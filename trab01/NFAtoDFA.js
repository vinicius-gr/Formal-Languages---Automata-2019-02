"use strict";

const EPSILON = "EPSILON";

function getEClousure(NFA, s) {
  let EClosure = [];
  let state = s;
  while (state) {
    EClosure = EClosure.concat(state);
    state = NFA.transitions[state][EPSILON];
  }
  return EClosure;
}

function getETransitions(NFA, s) {
  let EClosure = [];
  let state = s;
  while (state) {
    state = NFA.transitions[state][EPSILON];
    EClosure = EClosure.concat(state);
  }
  return EClosure;
}

function getAllSubsets(arr) {
  return arr.reduce(
    (subsets, value) =>
      subsets.concat(subsets.map(set => [value, ...set].sort())),
    [[]]
  );
}

function getFinalStatesFromNFA(NFA) {
  return getAllSubsets(NFA.states).filter(v => {
    for (const state of v) {
      return NFA.acceptStates.includes(state);
    }
  });
}

function removeDuplicateCharacters(string) {
  return string
    .split("")
    .filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    })
    .join("");
}

function getETransition(NFA, state, symbol) {
  let aux = NFA.transitions[state][symbol] || [];

  if (NFA.transitions[state][EPSILON] && !NFA.transitions[state][symbol]) {
    aux = aux.concat(getETransitions(NFA, state));
  }

  aux = aux.toString().replace(/,/g, "");
  aux = removeDuplicateCharacters(aux);
  return aux.split("");
}

function getDeterministicTransitions(NFA) {
  let transitions = {};
  const newStatesStack = [getEClousure(NFA, NFA.start)];
  let states = [];

  do {
    let stateArray = newStatesStack.pop();
    let stateString = stateArray.toString().replace(/,/g, "");
    states.push(stateString);

    transitions[stateString] = {};

    for (const symbol of NFA.alphabet) {
      let transition = {};
      transition[symbol] = [];
      for (const separateState of stateArray) {
        transition[symbol] = getETransition(NFA, separateState, symbol).concat(
          transition[symbol]
        );
      }
      transitions[stateString][symbol] = removeDuplicateCharacters(
        transition[symbol]
          .sort()
          .toString()
          .replace(/,/g, "")
      );
      if (states.indexOf(transitions[stateString][symbol]) < 0) {
        newStatesStack.push(transitions[stateString][symbol]);
      }
    }
  } while (newStatesStack.length);

  return transitions;
}

module.exports = function toDFA(NFA) {
  let DFA = {
    states: getAllSubsets(NFA.states).map(v => v.toString().replace(/,/g, "")),
    alphabet: NFA.alphabet,
    transitions: getDeterministicTransitions(NFA),
    start: getEClousure(NFA, NFA.start)
      .toString()
      .replace(/,/g, ""),
    acceptStates: getFinalStatesFromNFA(NFA).map(v =>
      v.toString().replace(/,/g, "")
    )
  };

  return DFA;
};

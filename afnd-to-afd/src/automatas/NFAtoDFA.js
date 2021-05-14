"use strict";

import DeterministcFiniteAutomata from "./DFA.js";

function parseNFA({ states, alphabet, transitions, start, acceptanceStates }) {
  let parsedStates = new Set();
  let parsedTransitions = {};
  let parsedacceptanceStates = [];
  parsedStates.add(start);

  parsedStates.forEach((state) => {
    console.log("\nExpanding state=", state);
    alphabet.split("").map((symbol) => {
      parsedTransitions[state] = parsedTransitions[state]
        ? parsedTransitions[state]
        : {};
      console.log(
        "State=" + state + "\nParsed transitions=",
        parsedTransitions[state]
      );
      if (state.includes("_")) {
        let set = new Set();
        state.split("_").forEach((sub_state) => {
          if (transitions[sub_state][symbol]) {
            if (Array.isArray(transitions[sub_state][symbol]))
              transitions[sub_state][symbol].map((v) => set.add(v));
            else set.add(transitions[sub_state][symbol]);
          }
        });
        parsedTransitions[state][symbol] = Array.from(set).sort().join("_");
        console.log(
          "State=" + state + "\nParsed transitions=",
          parsedTransitions[state]
        );
      } else if (
        transitions[state] &&
        transitions[state].hasOwnProperty(symbol) &&
        transitions[state][symbol]
      ) {
        //verifica se a transição é deterministica
        if (Array.isArray(transitions[state][symbol])) {
          //concatena a transição nao deterministica
          parsedTransitions[state][symbol] = transitions[state][symbol].join(
            "_"
          );
          console.log("New State=", parsedTransitions[state][symbol]);
        } else {
          parsedTransitions[state][symbol] = transitions[state][symbol];
        }
      } else {
        parsedTransitions[state][symbol] = "💀💀💀";
      }
      //adiciona o estado relacionado a transição convertida na lista de estados convertidos
      if (
        parsedTransitions[state] &&
        parsedTransitions[state].hasOwnProperty(symbol) &&
        parsedTransitions[state][symbol] &&
        !parsedStates.has(parsedTransitions[state][symbol])
      )
        parsedStates.add(parsedTransitions[state][symbol]);
    });
  });

  parsedStates.forEach((state) => {
    if (state.includes(acceptanceStates)) parsedacceptanceStates.push(state);
  });

  return {
    parsedStates,
    parsedTransitions,
    start,
    parsedacceptanceStates,
  };
}

export default function toDFA(NFA) {
  const {
    parsedStates,
    parsedTransitions,
    start,
    parsedacceptanceStates,
  } = parseNFA(NFA);
  return new DeterministcFiniteAutomata({
    states: Array.from(parsedStates),
    alphabet: NFA.alphabet,
    transitions: parsedTransitions,
    start: start,
    acceptanceStates: parsedacceptanceStates,
  });
}

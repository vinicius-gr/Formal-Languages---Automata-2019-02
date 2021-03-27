"use strict";

function getFinalStatesFromNFA(NFA) {
    return getAllSubsets(NFA.states).filter(v => {
        for (const state of v) {
            return NFA.acceptStates.includes(state);
        }
    });
}

function getDeterministicTransitions(NFA) {
    let transitions = {};
    let states = [];

    do {

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

export default function toDFA(NFA) {
    debugger
    let DFA = {
        states: getAllSubsets(NFA.states).map(v => v.toString().replace(/,/g, "")),
        alphabet: NFA.alphabet,
        transitions: getDeterministicTransitions(NFA),
        start: getEClousure(NFA, NFA.start).toString().replace(/,/g, ""),
        acceptStates: getFinalStatesFromNFA(NFA).map(v => v.toString().replace(/,/g, ""))
    };

    return DFA;
};
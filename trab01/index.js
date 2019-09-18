"use strict";

const DeterministcFiniteAutomata = require("./DFA.js");
const NonDeterministcFiniteAutomata = require("./NFA.js");
const toDFA = require("./NFAtoDFA.js");

const DataLocation = process.argv[3];
const analiseWord = process.argv[4];
const automataType = process.argv[2];

const data = require(DataLocation);

if (automataType === "DFA") {
  const DFA = new DeterministcFiniteAutomata(
    data.states,
    data.alphabet,
    data.transitions,
    data.start,
    data.acceptStates
  );

  console.log(DFA.test(analiseWord));
} else if (automataType === "NFA") {
  const NFA = new NonDeterministcFiniteAutomata(
    data.states,
    data.alphabet,
    data.transitions,
    data.start,
    data.acceptStates
  );

  console.log(NFA.test(analiseWord));
} else if (automataType === "toDFA") {
  console.log(toDFA(data));
}

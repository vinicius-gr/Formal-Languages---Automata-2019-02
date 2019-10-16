const regex = require('./src/regex');
const NFA = require('./src/nfa');
const DFA = require('./src/dfa');

const expression = '(abc)*';
const alphabet = 'abc';
const regexTree = regex(expression, alphabet);
console.log(JSON.stringify(regexTree, null, 4));

let nfa = NFA.fromRegexTree(regexTree, alphabet);
delete nfa._state;
console.log(JSON.stringify(nfa, null, 4));
console.log('initial state', nfa.initialState);
console.log('final state', nfa.finalState);

let trials = [
    'abcabc',
];

for (let t of trials) {
    console.log('%s:', t, nfa.check(t));
}

let dfa = DFA.fromNFA(nfa);
delete dfa._state;
console.log(dfa);

for (let t of trials) {
    console.log('%s:', t, dfa.check(t));
}
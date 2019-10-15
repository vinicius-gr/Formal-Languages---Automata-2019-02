const regex = require('./src/regex');
const NFA = require('./src/nfa');
const DFA = require('./src/dfa');

const expression = '(ab|ba)*c';
const alphabet = 'abc';

const tree = regex(expression, alphabet);
console.log(JSON.stringify(tree, null, 4));

const nfa = NFA.parseFromRegexTree(tree, alphabet);
console.log(JSON.stringify(nfa, null, 4));
console.log('initial state', nfa.initialState);
console.log('final state', nfa.finalState);

let testes = [
    'abc',
    'abb',
    'ababb',
    'aaabb',
    'abbbabb',
    'babbabb',
    'baaaabb',
    'baabb',
    'aaabbb',
];

for (let t of testes) {
    console.log('%s:', t, nfa.check(t));
}

let dfa = DFA.fromNFA(nfa, null, 4);
console.log(dfa, null, 4);

for (let t of testes) {
    console.log('%s:', t, dfa.check(t));
}

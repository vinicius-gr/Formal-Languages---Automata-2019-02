export default class NonDeterministcFiniteAutomata {
    constructor(Q, E, D, q0, F) {
        this.states = Q;
        this.alphabet = E;
        this.transitions = D;
        this.start = q0;
        this.acceptanceStates = F;
    }

    test(word, currentState = this.start, visited = new Set()) {

        while (!visited.has(currentState)) {
            const symbol = word[0]
            word = word.slice(1);
            if (!this.alphabet.includes(symbol)) {
                return false;
            }
            if (Array.isArray(this.transitions[currentState][symbol])) {
                this.transitions[currentState][symbol].forEach(element => {
                    currentState = this.transitions[element][symbol];
                    visited.add(currentState);
                });
            } else {
                currentState = this.transitions[currentState][symbol];
            }
            console.log(currentState);
        }

        if (this.acceptanceStates.some(s => currentState.includes(s))) {
            return true;
        }

        return false;
    }
};
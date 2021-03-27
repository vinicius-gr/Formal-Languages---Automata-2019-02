export default class NonDeterministcFiniteAutomata {
    constructor(Q, E, D, q0, F) {
        this.states = Q;
        this.alphabet = E;
        this.transition = D;
        this.start = q0;
        this.accepts = F;
    }

    delta(symbol, state) {
        if (this.transition[state][symbol]) {
            return this.transition[state][symbol];
        }
        return [];
    }

    test(word, currentState = this.start, visited = new Set()) {

        while (!visited.has(currentState)) {
            const symbol = word[0]
            word = word.slice(1);
            if (!this.alphabet.includes(symbol)) {
                return false;
            }
            if (Array.isArray(this.transition[currentState][symbol])) {
                this.transition[currentState][symbol].forEach(element => {
                    currentState = this.transition[element][symbol];
                    visited.add(currentState);
                });
            } else {
                currentState = this.transition[currentState][symbol];
            }
            console.log(currentState);
        }

        if (this.accepts.some(s => currentState.includes(s))) {
            return true;
        }

        return false;
    }
};
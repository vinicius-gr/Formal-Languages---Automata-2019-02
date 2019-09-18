const EPSILON = "EPSILON";

module.exports = class NonDeterministcFiniteAutomata {
  constructor(Q, E, D, q0, F) {
    this.states = Q;
    this.alphabet = E;
    this.transition = D;
    this.start = q0;
    this.accepts = F;
  }

  getTransitionsOfChar(symbol, state) {
    if (this.transition[state][symbol]) {
      return this.transition[state][symbol];
    }
    return [];
  }

  test(word, currentState = this.start, visited = new Set()) {
    if (visited.has(currentState)) {
      return false;
    }

    visited.add(currentState);

    if (!word.length) {
      if (this.accepts.includes(currentState)) {
        return true;
      }

      for (const nextState of this.getTransitionsOfChar(
        EPSILON,
        currentState
      )) {
        if (this.test("", nextState, visited)) {
          return true;
        }
      }
      return false;
    }

    const symbol = word[0];
    const restOfTheWord = word.slice(1);

    const transitionsOfCurrentChar = this.getTransitionsOfChar(
      symbol,
      currentState
    );

    for (const nextState of transitionsOfCurrentChar) {
      if (this.test(restOfTheWord, nextState)) {
        return true;
      }
    }

    for (const nextState of this.getTransitionsOfChar(EPSILON, currentState)) {
      if (this.test(word, nextState, visited)) {
        return true;
      }
    }

    return false;
  }
};

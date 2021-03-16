export class DeterministcFiniteAutomata {
  constructor({
    states: Q,
    alphabet: E,
    transitions: D,
    start: q0,
    acceptanceStates: F,
  }) {
    this.states = Q;
    this.alphabet = E;
    this.transition = D;
    this.start = q0;
    this.accepts = F;
  }

  move(currentState, input) {
    if (!this.alphabet.includes(input)) {
      return undefined;
    }
    return this.transition[currentState][input];
  }

  test(w) {
    let currentState = this.start;
    let word = w.split("");

    for (let i in word) {
      let c = word[i];
      if (!this.alphabet.includes(c)) {
        return false;
      }
      currentState = this.transition[currentState][c];
    }

    if (this.accepts.includes(currentState)) {
      return true;
    }

    return false;
  }
}

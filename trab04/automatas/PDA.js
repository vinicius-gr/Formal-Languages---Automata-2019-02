import * as Utils from "../utils/utils.js";

export default class PushdownAutomata {
  constructor(Q, S, G, D, q0, stackTop, F) {
    this.states = Q;
    this.inputAlphabet = S;
    this.stackAlphabet = G;
    this.transitions = D;
    this.start = q0;
    this.stackTop = stackTop;
    this.final = F;
    this.stack = [];
  }

  getTransitionsOfChar(symbol, state) {
    if (this.transitions[state] == undefined) {
      return [];
    }
    if (this.transitions[state][symbol]) {
      if (!Array.isArray(this.transitions[state][symbol])) {
        return [this.transitions[state][symbol]];
      }
      return this.transitions[state][symbol];
    }
    return [];
  }

  test(word, currentState = this.start, path = [], visited = new Set()) {
    if (visited.has(currentState)) {
      console.log(path);
      return [false, path];
    }

    visited.add(currentState);
    path.push(visited);

    if (!word.length) {
      if (this.final.includes(currentState)) {
        console.log(path);
        return [true, path];
      }

      for (const nextState of this.getTransitionsOfChar(
        Utils.EPSILON,
        currentState
      )) {
        if (this.test("", nextState, path, visited)[0]) {
          console.log(path);
          return [true, path];
        }
      }
      console.log(path);
      return [false, path];
    }

    const symbol = word[0];
    const restOfTheWord = word.slice(1);

    const transitionsOfCurrentChar = this.getTransitionsOfChar(
      symbol,
      currentState
    );

    for (const nextState of transitionsOfCurrentChar) {
      if (this.test(restOfTheWord, nextState, path)[0]) {
        console.log(path);
        return [true, path];
      }
    }

    for (const nextState of this.getTransitionsOfChar(
      Utils.EPSILON,
      currentState
    )) {
      if (this.test(word, nextState, path, visited)[0]) {
        console.log(path);
        return [true, path];
      }
    }

    console.log(path);
    return [false, path];
  }
}

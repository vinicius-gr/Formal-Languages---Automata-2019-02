import * as Utils from "./utils.js";

class FiniteAutomataState {
  constructor() {
    this.next_state = {};
  }
}
export class EpsilonNFA {
  constructor() {
    this.transitions = {};
    this.index = -1;
    this.NFAStack = [];
  }

  evalRegex(expressionTree) {
    if (expressionTree.type === Utils.OP_TYPES.SYMBOL)
      return this.evalRegexSymbol(expressionTree);

    if (expressionTree.type === Utils.OP_TYPES.CONCAT)
      return this.evalRegexConcat(expressionTree);

    if (expressionTree.type === Utils.OP_TYPES.UNION)
      return this.evalRegexUnion(expressionTree);

    if (expressionTree.type === Utils.OP_TYPES.KLEENE)
      return this.evalRegexKleene(expressionTree);
  }

  evalRegexSymbol(et) {
    let start_state = new FiniteAutomataState();
    let end_state = new FiniteAutomataState();

    start_state.next_state[et.value] = [end_state];

    return [start_state, end_state];
  }

  evalRegexConcat(et) {
    let left_nfa = this.evalRegex(et.left);
    let right_nfa = this.evalRegex(et.right);

    left_nfa[1].next_state["ε"] = right_nfa[0];

    return [left_nfa[0], right_nfa[1]];
  }

  evalRegexUnion(et) {
    let start_state = new FiniteAutomataState();
    let end_state = new FiniteAutomataState();

    let up_nfa = this.evalRegex(et.left);
    let down_nfa = this.evalRegex(et.right);

    start_state.next_state["ε"] = [up_nfa[0], down_nfa[0]];
    up_nfa[1].next_state["ε"] = [end_state];
    down_nfa[1].next_state["ε"] = [end_state];

    return [start_state, end_state];
  }

  evalRegexKleene(et) {
    let start_state = new FiniteAutomataState();
    let end_state = new FiniteAutomataState();

    let sub_nfa = this.evalRegex(et.left);

    start_state.next_state["ε"] = [sub_nfa[0], end_state];
    sub_nfa[1].next_state["ε"] = [sub_nfa[0], end_state];

    return [start_state, end_state];
  }

  getKey(obj) {
    return Object.keys(obj)[0];
  }

  getKeyValue(obj) {
    return obj[Object.keys(obj)[0]];
  }

  newState() {
    this.index += 1;
    return `S${this.index}`;
  }
}

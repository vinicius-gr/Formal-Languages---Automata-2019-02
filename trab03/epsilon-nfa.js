import * as Utils from "./utils/utils.js";

class FiniteAutomata {
  constructor() {
    this.alphabet = "";
    this.states = [];
    this.transitions = {};
    this.start = "";
    this.final = "";
  }
}
export class EpsilonNFA {
  constructor() {
    this.index = -1;
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
    let nfa = new FiniteAutomata();

    nfa.start = this.indexGenerator();
    nfa.final = this.indexGenerator();
    nfa.states.push(nfa.start, nfa.final);

    if (!nfa.alphabet.includes(et.value))
      nfa.alphabet = nfa.alphabet.concat(et.value);

    nfa.transitions[nfa.start] = {
      [et.value]: nfa.final,
    };
    return nfa;
  }

  evalRegexEpsilon(et) {
    let nfa = new FiniteAutomata();

    nfa.states.push(this.indexGenerator(), this.indexGenerator());
    if (!nfa.alphabet.includes("ε")) nfa.alphabet = nfa.alphabet.concat("ε");

    nfa.transitions[nfa.start] = {
      ε: nfa.final,
    };
    return nfa;
  }

  evalRegexConcat(et) {
    let left_nfa = this.evalRegex(et.left);
    let right_nfa = this.evalRegex(et.right);

    let nfa = new FiniteAutomata();
    nfa.states.push(...left_nfa.states, ...right_nfa.states);
    nfa.transitions = { ...left_nfa.transitions, ...right_nfa.transitions };
    nfa.transitions[left_nfa.final] = { ε: right_nfa.start };
    nfa.start = left_nfa.start;
    nfa.final = right_nfa.final;
    nfa.alphabet = nfa.alphabet.concat(left_nfa.alphabet, right_nfa.alphabet);
    nfa.alphabet = nfa.alphabet.concat("ε");
    return nfa;
  }

  evalRegexUnion(et) {
    let nfa = new FiniteAutomata();
    let up_nfa = this.evalRegex(et.left);
    let down_nfa = this.evalRegex(et.right);

    nfa.start = this.indexGenerator();
    nfa.final = this.indexGenerator();

    nfa.states.push(nfa.start, nfa.final);
    nfa.states.push(...up_nfa.states, ...down_nfa.states);
    nfa.transitions = { ...up_nfa.transitions, ...down_nfa.transitions };

    nfa.transitions[nfa.start] = { ε: [up_nfa.start, down_nfa.start] };
    nfa.transitions[up_nfa.final] = { ε: nfa.final };
    nfa.transitions[down_nfa.final] = { ε: nfa.final };

    nfa.alphabet = nfa.alphabet.concat(up_nfa.alphabet, down_nfa.alphabet);
    nfa.alphabet = nfa.alphabet.concat("ε");

    return nfa;
  }

  evalRegexKleene(et) {
    let nfa = new FiniteAutomata();
    let sub_nfa = this.evalRegex(et.left);

    nfa.start = this.indexGenerator();
    nfa.final = this.indexGenerator();

    nfa.states.push(nfa.start, nfa.final);
    nfa.states.push(...sub_nfa.states);

    nfa.transitions = { ...sub_nfa.transitions };
    nfa.transitions[sub_nfa.final] = { ε: [sub_nfa.start, nfa.final] };
    nfa.transitions[nfa.start] = { ε: [sub_nfa.start, nfa.final] };

    nfa.alphabet = nfa.alphabet.concat(sub_nfa.alphabet);
    nfa.alphabet = nfa.alphabet.concat("ε");

    return nfa;
  }

  indexGenerator() {
    this.index += 1;
    return `S${this.index}`;
  }
}

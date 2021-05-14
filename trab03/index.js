import * as shunt from "./shunt.js";
import { ExpressionTree } from "./expression-tree.js";
import { EpsilonNFA } from "./epsilon-nfa.js";

const postRE = shunt.infixToPostfix("a+b");

const et = new ExpressionTree().buildTree(postRE);

const enfa = new EpsilonNFA().evalRegex(et);

console.log(enfa);

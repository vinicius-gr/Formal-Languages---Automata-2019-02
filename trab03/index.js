import * as shunt from "./shunt.js";
import { ExpressionTree } from "./expression-tree.js";

const postRE = shunt.infixToPostfix("(a+b)");

console.log(ExpressionTree.buildTree(postRE));

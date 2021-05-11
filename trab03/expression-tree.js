import * as Utils from "./utils.js";

const OP_TYPES = {
  SYMBOL: "symbol",
  CONCAT: "concat",
  UNION: "union",
  KLEENE: "kleene",
};
Object.freeze(OP_TYPES);

export class ExpressionTree {
  constructor(type, value = undefined) {
    this.type = type;
    this.value = value;
    this.left = undefined;
    this.right = undefined;
  }

  static buildTree(postfixRE) {
    let stack = [];

    postfixRE.split("").forEach((symbol) => {
      if (Utils.isLetter(symbol)) {
        stack.push(new ExpressionTree(OP_TYPES.SYMBOL, symbol));
      } else {
        let temp;
        if (symbol === "+") {
          temp = new ExpressionTree(OP_TYPES.UNION);
          temp.right = stack.pop();
          temp.left = stack.pop();
        } else if (symbol === ".") {
          temp = new ExpressionTree(OP_TYPES.CONCAT);
          temp.right = stack.pop();
          temp.left = stack.pop();
        } else if (symbol === "*") {
          temp = new ExpressionTree(OP_TYPES.KLEENE);
          temp.left = stack.pop();
        }
        stack.push(temp);
      }
    });
    return stack[0];
  }
}

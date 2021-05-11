import * as Utils from "./utils.js";
export function infixToPostfix(regexp) {
  let opStack = [];
  let outputQueue = [];
  let precedence = { "*": 3, "+": 2, ".": 1 };

  regexp.split("").forEach((symbol) => {
    if (Utils.isLetter(symbol)) {
      outputQueue.push(symbol);
    }

    if (Utils.isOperator(symbol) && opStack[opStack.length - 1] === "(") {
      opStack.push(symbol);
    } else if (Utils.isOperator(symbol)) {
      if (
        Utils.isOperator(opStack[opStack.length - 1]) &&
        precedence[opStack[opStack.length - 1]] >= precedence[symbol]
      ) {
        while (precedence[opStack[opStack.length - 1]] >= precedence[symbol]) {
          outputQueue.push(opStack.pop());
        }
        opStack.push(symbol);
      } else {
        opStack.push(symbol);
      }
    }

    if (symbol === "(") {
      opStack.push(symbol);
    }

    if (symbol === ")") {
      while (opStack[opStack.length - 1] !== "(") {
        outputQueue.push(opStack.pop());
      }
      opStack.pop();
    }
  });

  while (opStack.length) {
    outputQueue.push(opStack.pop());
  }

  return outputQueue.join("");
}

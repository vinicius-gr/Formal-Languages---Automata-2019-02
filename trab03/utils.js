export function isLetter(c) {
  return c.toLowerCase() !== c.toUpperCase();
}

export function isOperator(o) {
  return /[+.*]/.test(o);
}

export const OP_TYPES = {
  SYMBOL: "symbol",
  CONCAT: "concat",
  UNION: "union",
  KLEENE: "kleene",
};
Object.freeze(OP_TYPES);

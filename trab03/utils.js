export function isLetter(c) {
  return c.toLowerCase() !== c.toUpperCase();
}

export function isOperator(o) {
  return /[+.*]/.test(o);
}

module.exports = function (expression, alphabet) {
    let pos = 0;

    let eval = function () {
        let terms = [term()];
        while (expression[pos] == '|') {
            pos++;
            terms.push(term());
        }

        if (terms.length > 1) {
            return { 'or': terms };
        } else if (terms.length == 1) {
            return terms[0];
        } else {
            return null;
        }
    };

    let isFactor = function (s) {
        return alphabet.indexOf(s) !== -1 || s == '(';
    }

    let term = function () {
        let factors = [factor()];
        while (expression[pos] == '&' || isFactor(expression[pos])) {
            if (!isFactor(expression[pos])) {
                pos++;
            }

            factors.push(factor());
        }

        if (factors.length > 1) {
            return { 'and': factors };
        } else if (factors.length == 1) {
            return factors[0];
        } else {
            return null;
        }
    };

    let factor = function () {
        let r = 0;
        if (expression[pos] == '(') {
            pos++;
            r = eval();
            pos++;
        } else {
            r = expression[pos];
            pos++;
        }

        if (expression[pos] == '*') {
            r = { 'star': r };
            pos++;
        }

        return r;
    };

    return eval();
};
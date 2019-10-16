var NFA = require('./nfa.js');

var numCmp = function (x, y) {
    return x - y;
};

var Conceal = {};
Conceal._list = {};
Conceal._assoc = {};
Conceal._idx = 0;
Conceal.stringify = function (v) {
    var key = JSON.stringify(v);
    if (key in Conceal._assoc) {
        return Conceal._assoc[key];
    }

    Conceal._assoc[key] = Conceal._idx;
    Conceal._list[Conceal._idx] = v;

    return this._idx++;
};
Conceal.parse = function (id) {
    return Conceal._list[id];
};


var DFA = function (alphabet, initialState) {
    this.initialState = initialState;
    this.finalStates = new Set();
    this.alphabet = alphabet || '';
    this._transitions = {};
    this._state = 0;
};

DFA.fromNFA = function (nfa, alphabet) {
    var dfa = new this(alphabet);
    dfa._fromNFA(nfa);

    return dfa;
}

DFA.prototype.newState = function () {
    this._transitions.push({});

    return this._state++;
};

DFA.prototype.addTransition = function (from, to, accept) {
    if (!(from in this._transitions)) {
        this._transitions[from] = {};
    }

    this._transitions[from][accept] = to;
};

DFA.prototype.isFinalState = function (state) {
    return this.finalStates.has(state);
}

DFA.prototype.check = function (s) {
    var self = this;
    var _dfs = function (state, pos) {
        if (pos == s.length && self.isFinalState(state)) {
            return true;
        }

        var accept = s[pos];
        if (state in self._transitions && accept in self._transitions[state]) {
            var newState = self._transitions[state][accept];
            if (_dfs(newState, pos + 1)) {
                return true;
            }
        }

        return false;
    };

    return _dfs(this.initialState, 0);
};

DFA.prototype._fromNFA = function (nfa) {
    var epsClosure = function (state, states) {
        var states = new Set([state]);
        var Q = [state];
        while (Q.length > 0) {
            var p = Q.shift();
            if (!(p in nfa._transitions) ||
                !(NFA.EPS in nfa._transitions[p])
            ) {
                continue;
            }

            for (var q of nfa._transitions[p][NFA.EPS]) {
                if (!states.has(q)) {
                    states.add(q);
                    Q.push(q);
                }
            }
        }

        states = Array.from(states).sort(numCmp);

        return states;
    };



    this.alphabet = nfa.alphabet;
    console.log(this.alphabet);

    var Q = [];
    var marked = {};

    this.initialState = Conceal.stringify(epsClosure(nfa.initialState));
    Q.push(this.initialState);
    while (Q.length > 0) {
        var state = Q.shift();
        if (marked[state]) {
            continue;
        }

        var nfaStates = Conceal.parse(state);
        for (var p of nfaStates) {
            if (nfa.isFinalState(p)) {
                this.finalStates.add(state);
                break;
            }
        }

        for (var a of this.alphabet) {
            var newState = [];
            for (var p of nfaStates) {
                if (!(p in nfa._transitions)
                    || !(a in nfa._transitions[p])
                ) {
                    continue;
                }

                newState = newState.concat(nfa._transitions[p][a]);
            }

            if (newState.length == 0) {
                continue;
            }

            newState = new Set(newState);
            newState = Array.from(newState).reduce(function (acc, val) {
                return acc.concat(epsClosure(val));
            }, []);
            newState = new Set(newState);
            newState = Array.from(newState).sort(numCmp);
            newState = Conceal.stringify(newState);

            this.addTransition(state, newState, a);
            if (marked[newState] !== true) {
                Q.push(newState);
            }
        }

        marked[state] = true;
    }

};

module.exports = DFA;
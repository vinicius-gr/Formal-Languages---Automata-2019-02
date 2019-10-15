const NFA = function (alphabet, initialState, finalState) {
    this.initialState = initialState;
    this.finalState = finalState;
    this.alphabet = alphabet || '';
    this._transitions = [];
    this._state = 0;
};
NFA.EPS = 'ε';

NFA.parseFromRegexTree = function (tree, alphabet) {
    const nfa = new this(alphabet);
    const states = nfa._parseFromRegexTree(tree);
    nfa.initialState = states.initialState;
    nfa.finalState = states.finalState;

    return nfa;
};

NFA.prototype.newState = function () {
    this._transitions.push({});

    return this._state++;
};

NFA.prototype.isFinalState = function (state) {
    return this.finalState === state;
};

NFA.prototype.addTransition = function (from, to, accept) {
    accept = accept || NFA.EPS;
    if (!this._transitions[from][accept]) {
        this._transitions[from][accept] = [];
    }

    this._transitions[from][accept].push(to);
};

NFA.prototype.check = function (s) {
    let self = this;
    let _dfs = function (state, pos) {
        if (pos == s.length && self.isFinalState(state)) {
            return true;
        }

        for (let accept of [NFA.EPS, s[pos]]) {
            if (!(accept in self._transitions[state])) {
                continue;
            }

            let newPos = pos + (accept !== NFA.EPS);
            for (let newState of self._transitions[state][accept]) {
                if (_dfs(newState, newPos)) {
                    return true;
                }
            }
        }

        return false;
    };

    return _dfs(this.initialState, 0);
};

NFA.prototype._parseFromRegexTree = function (tree) {
    let initialState = this.newState();
    let finalState = this.newState();
    if (typeof (tree) !== 'object') {
        let accept = tree;
        this.addTransition(initialState, finalState, accept);
    } else if ('or' in tree) {
        for (let leaf of tree['or']) {
            let nfa = this._parseFromRegexTree(leaf);
            this.addTransition(initialState, nfa.initialState);
            this.addTransition(nfa.finalState, finalState);
        }
    } else if ('and' in tree) {
        let state = this.newState();
        this.addTransition(initialState, state);
        for (let leaf of tree['and']) {
            let nfa = this._parseFromRegexTree(leaf);
            this.addTransition(state, nfa.initialState);
            state = nfa.finalState;
        }
        this.addTransition(state, finalState);
    } else if ('star' in tree) {
        this.addTransition(initialState, finalState);

        let state1 = this.newState();
        this.addTransition(initialState, state1);

        let leaf = tree['star'];
        let nfa2 = this._parseFromRegexTree(leaf);
        this.addTransition(state1, nfa2.initialState);
        this.addTransition(nfa2.finalState, state1);
        this.addTransition(nfa2.finalState, finalState);
    }

    return {
        'initialState': initialState,
        'finalStates': finalState
    };
};

module.exports = NFA;

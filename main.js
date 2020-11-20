function _addWord(t, s, v) {
    for (const c of s) {
        const cp = c.codePointAt(0);
        if (!t.has(cp)) {
            t.set(cp, new Map())
        }
        t = t.get(cp);
    }
    t.__trie_val = v;
}
const DICT_FROM = {
    "cn": ["STCharacters", "STPhrases"],
    "hk": ["HKVariantsRev", "HKVariantsRevPhrases"],
    "tw": ["TWVariantsRev", "TWVariantsRevPhrases"],
    "jp": ["JPVariantsRev", "JPShinjitaiCharacters", "JPShinjitaiPhrases"]
};
const DICT_TO = {
    "cn": ["TSCharacters", "TSPhrases"],
    "hk": ["HKVariants"],
    "tw": ["TWVariants"],
    "jp": ["JPVariants"]
};
let dictFroms = {}
let dictTos = {}
function _load_dict(s, type) {
    let DICTS;
    if (type === 'from') {
        DICTS = DICT_FROM[s];
        if (dictFroms[s]) {
            return dictFroms[s];
        }
    } else if (type === 'to') {
        DICTS = DICT_TO[s];
        if (dictTos[s]) {
            return dictTos[s];
        }
    }
    const t = new Map();
    for (const DICT of DICTS) {
        const d = dict[DICT];
        for (const l in d) {
            const r = d[l];
            _addWord(t, l, r);
        }
    }
    if (type === 'from') {
        dictFroms[s] = t;
    } else {
        dictTos[s] = t;
    }
    return t;
};
function _convert(t, s) {
    const n = s.length, arr = [];
    let orig_i;
    for (let i = 0; i < n;) {
        let t_curr = t, k = 0, v;
        for (let j = i; j < n;) {
            const x = s.codePointAt(j);
            j += x > 0xffff ? 2 : 1;
            const t_next = t_curr.get(x);
            if (typeof t_next === 'undefined') {
                break;
            }
            t_curr = t_next;
            const v_curr = t_curr.__trie_val;
            if (typeof v_curr !== 'undefined') {
                k = j;
                v = v_curr;
            }
        }
        if (k > 0) {
            if (orig_i !== null) {
                arr.push(s.slice(orig_i, i));
                orig_i = null;
            }
            arr.push(v);
            i = k;
        } else {
            if (orig_i === null) {
                orig_i = i;
            }
            i += s.codePointAt(i) > 0xffff ? 2 : 1;
        }
    }
    if (orig_i !== null) {
        arr.push(s.slice(orig_i, n));
    }
    return arr.join('');
};
function convert(from_locale, to_locale, s) {
    if (from_locale !== 't') {
        const d = _load_dict(from_locale, 'from');
        s = _convert(d, s);
    }
    if (to_locale !== 't') {
        const d = _load_dict(to_locale, 'to');
        s = _convert(d, s);
    }
    return s;
}

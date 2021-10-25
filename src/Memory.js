const KEY_REGEXP = /^\$(.+?)(\((.*)\))?$/;

const PARAMS_SPLIT_REGEXP = /\s*,\s*/;
const QUOTES_REPLACE_REGEXP = /^['"]|['"]$/g;
const STRING_TYPE_REGEXP = /^'.+'|".+"$/;
const NUMBER_TYPE_REGEXP = /^\d+|\d+\.\d+$/;  

class Memory {

    getValue(str) {
        const keyMatch = str.match(KEY_REGEXP);
        const key = keyMatch ? keyMatch[1] : null;
        if (key) {
            if (!(key in this)) throw new Error(`${key} is not found in memory`);
            if (typeof this[key] === 'function') {
                const params = this.getComputedParams(str);
                return this[key].apply(null, params)
            }
            return this[key]
        }
        return str;
    }

    getComputedParams(str) {
        const paramsString = str.match(KEY_REGEXP);
        if (!(paramsString && paramsString[3])) return []
        const params = paramsString[3].split(PARAMS_SPLIT_REGEXP);
        return params.map(p => {
            if (STRING_TYPE_REGEXP.test(p)) return p.replace(QUOTES_REPLACE_REGEXP, '')
            if (NUMBER_TYPE_REGEXP.test(p)) return parseFloat(p)
            if (KEY_REGEXP.test(p)) return this.getValue(p)
        })
    }

    register(obj) {
        for (const prop in obj) {
            this[prop] = obj[prop];
        }
    }
}

module.exports = new Memory();
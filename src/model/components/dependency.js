/**
 * A Software Dependency
 */
class Dependency {
    constructor(source, target) {
        this._source = source;
        this._target = target;
    }

    /**
     * Convert Dependency to String
     * @return {string}
     */
    toString() {
        return this._source + ' -> + ' + this._target;
    }

    get source() {
        return this._source;
    }

    get target() {
        return this._target;
    }
}

module.exports = Dependency;

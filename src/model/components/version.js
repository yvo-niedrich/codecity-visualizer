/**
 * A Software Version
 */
class Version {
    /**
     * Create a new software version
     * @param  {string}   identifier Key/Identifier for this node
     * @return {function}            Get a fresh Version-Object
     */
    constructor(key, label) {
        this._key   = key;
        this._label = label;
    };

    /**
     * Convert Object to String (it's key)
     * @return {string}
     */
    toString() {
        return this._key;
    };

    get key() {
        return this._key;
    };

    get label() {
        return this._label;
    };
}

module.exports = Version;

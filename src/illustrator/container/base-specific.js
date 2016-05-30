var BaseContainer = require("./base.js");

/**
 * These containers are use for specific Layout Algorithms.
 * They implement a basic interface for setting and getting options
 */
class SpecificContainer extends BaseContainer {

    constructor(key, options = {}) {
        super(key);
        this._defaults = {};
        this._options = options;
    }

    /**
     * Set the default options
     * @param def
     */
    set defaults(def) {
        this._defaults = def;
    }

    /**
     * Get the option of the key. If none is found, return null
     * @param key
     * @returns {*}
     */
    getOption(key) {
        if (key in this._options) {
            return this._options[key];
        }

        if (key in this._defaults) {
            return this._defaults[key];
        }

        return null;
    }
}

module.exports = SpecificContainer;

var BaseContainer = require("./base.js");

/**
 * TODO: Containers are able to mirror the placement algorithm on the X-Axis.
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

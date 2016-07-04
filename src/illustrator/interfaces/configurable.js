module.exports = function (SuperClass = Object) {
    /**
     * Classes can implement this Feature to become Configurable
     * @interface Configurable
     */
    return class Configurable extends SuperClass {
        /**
         * @param {Object} defaults
         */
        setDefaults(defaults = {}) {
            if (typeof(this._ic_defaults) === 'undefined' || this._ic_defaults === null) {
                this._ic_defaults = defaults;
            } else {
                throw 'Default values are already set';
            }
        }

        /**
         * Set all options. Overwrites all previous options.
         * @param {Object} options
         */
        setOptions(options = {}) {
            this._ic_options = options;
        }

        /**
         * Set a single option. Overwrites previous value.
         * @param {String} key
         * @param {*} value
         */
        setOption(key, value) {
            if (typeof(this._ic_options) === 'undefined' || this._ic_options === null) {
                this._ic_options = {};
            }

            this._ic_options[key] = value;
        }

        /**
         * Get the content for an option. return null, if no value was set.
         * @param key
         * @returns {*|null}
         */
        getOption(key) {
            if (typeof(this._ic_options) !== 'undefined' && this._ic_options !== null && key in this._ic_options) {
                return this._ic_options[key];
            }

            if (typeof(this._ic_defaults) !== 'undefined' && this._ic_defaults !== null && key in this._ic_defaults) {
                return this._ic_defaults[key];
            }

            return null;
        }

        /**
         * Require an option to be set. Throws an exception
         * @param key
         * @return {boolean}
         * @throws Exception if key is not set
         */
        requireOption(key) {
            if (typeof(this._ic_options) !== 'undefined' && this._ic_options !== null && key in this._ic_options) {
                return true;
            }

            throw 'Option `' + key + '` was not set.';
        }
    }
};

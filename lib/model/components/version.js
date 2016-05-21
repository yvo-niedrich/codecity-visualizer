"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A Software Version
 */

var Version = function () {
    /**
     * Create a new software version
     * @param  {string}   key   Identifier for this node
     * @param  {string}   label Versions (public) Label
     * @param  {int}      order Value of this version (Highest value is the latest version)
     * @return {function}       Get a fresh Version-Object
     */

    function Version(key, label) {
        var order = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        _classCallCheck(this, Version);

        this._key = key;
        this._label = label;
        this._value = parseInt(order);
    }

    _createClass(Version, [{
        key: "toString",


        /**
         * Convert Object to String (it's key)
         * @return {string}
         */
        value: function toString() {
            return this._key;
        }
    }, {
        key: "valueOf",


        /**
         * Value of this version (for comparison)
         * @return {int}
         */
        value: function valueOf() {
            return this._value;
        }

        /**
         * Get this versions model-identifier
         * @return {string}
         */

    }, {
        key: "key",
        get: function get() {
            return this._key;
        }
    }, {
        key: "label",


        /**
         * Get this versions Label
         * @return {string}
         */
        get: function get() {
            return this._label;
        }
    }]);

    return Version;
}();

module.exports = Version;
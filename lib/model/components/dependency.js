'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A Software Dependency
 */

var Dependency = function () {
    /**
     * Create a new software version
     * @param  {string}   identifier Key/Identifier for this node
     * @return {function}            Get a fresh Dependency-Object
     */

    function Dependency(source, target) {
        _classCallCheck(this, Dependency);

        this._source = source;
        this._target = target;
    }

    _createClass(Dependency, [{
        key: 'toString',


        /**
         * Convert Object to String
         * @return {string}
         */
        value: function toString() {
            return this._source + ' -> + ' + this._target;
        }
    }, {
        key: 'source',
        get: function get() {
            return this._source;
        }
    }, {
        key: 'target',
        get: function get() {
            return this._target;
        }
    }]);

    return Dependency;
}();

module.exports = Dependency;
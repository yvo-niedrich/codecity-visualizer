"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cuboid = function () {
    function Cuboid() {
        var length = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var width = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var height = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        _classCallCheck(this, Cuboid);

        this._length = length;
        this._width = width;
        this._height = height;
    }

    _createClass(Cuboid, [{
        key: "toString",
        value: function toString() {
            return "[" + this._width + " x " + this.length + " x " + this.height + "]";
        }
    }, {
        key: "length",
        set: function set(length) {
            this._length = length;
        },
        get: function get() {
            return this._length;
        }
    }, {
        key: "width",
        set: function set(width) {
            this._width = width;
        },
        get: function get() {
            return this._width;
        }
    }, {
        key: "height",
        set: function set(height) {
            this._height = height;
        },
        get: function get() {
            return this._height;
        }
    }, {
        key: "diagonal",
        get: function get() {
            return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2) + Math.pow(this.height, 2));
        }
    }, {
        key: "base",
        get: function get() {
            return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2));
        }
    }]);

    return Cuboid;
}();

module.exports = Cuboid;
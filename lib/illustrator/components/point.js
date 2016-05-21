"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
    function Point() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var z = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        _classCallCheck(this, Point);

        this._x = x;
        this._y = y;
        this._z = z;
    }

    _createClass(Point, [{
        key: "toString",
        value: function toString() {
            return "[" + this._x + ":" + this._y + ":" + this._z + "]";
        }
    }, {
        key: "x",
        get: function get() {
            return this._x;
        },
        set: function set(x) {
            this._x = x;
        }
    }, {
        key: "y",
        get: function get() {
            return this._y;
        },
        set: function set(y) {
            this._y = y;
        }
    }, {
        key: "z",
        get: function get() {
            return this._z;
        },
        set: function set(z) {
            this._z = z;
        }
    }]);

    return Point;
}();

module.exports = Point;
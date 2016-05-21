"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseContainer = require("./base.js");

/**
 * Containers are able to mirror the placement algorithm on the X-Axis.
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */

var MirrorContainer = function (_BaseContainer) {
    _inherits(MirrorContainer, _BaseContainer);

    function MirrorContainer(key) {
        var mirror = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, MirrorContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MirrorContainer).call(this, key));

        _this._mirrored = mirror;
        _this._separator = 0;
        return _this;
    }

    _createClass(MirrorContainer, [{
        key: "add",
        value: function add(shape) {
            _get(Object.getPrototypeOf(MirrorContainer.prototype), "add", this).call(this, shape);

            if (this._mirrored) {
                shape.rotate(180);
            }
        }
    }, {
        key: "isMirrored",
        get: function get() {
            return this._mirrored;
        }
    }, {
        key: "separator",
        set: function set(val) {
            this._separator = val;
        },
        get: function get() {
            return this._separator;
        }
    }]);

    return MirrorContainer;
}(BaseContainer);

;

module.exports = MirrorContainer;
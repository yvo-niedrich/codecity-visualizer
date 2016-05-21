"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MirrorContainer = require("./base-mirror.js");
/**
 * Rows Elements one after the other
 * 
 * @implements MirrorContainer
 * @implements BaseContainer
 * @implements BaseShape
 */

var RowContainer = function (_MirrorContainer) {
    _inherits(RowContainer, _MirrorContainer);

    function RowContainer(key) {
        var mirror = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, RowContainer);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(RowContainer).call(this, key, mirror));
    }

    _createClass(RowContainer, [{
        key: "_finalize",
        value: function _finalize() {
            _get(Object.getPrototypeOf(RowContainer.prototype), "_finalize", this).call(this);

            if (!this.size) {
                return;
            }

            this._calcualteFinalDimensions();
            this._positionShapes();
        }
    }, {
        key: "_calcualteFinalDimensions",
        value: function _calcualteFinalDimensions() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.shapes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var shape = _step.value;

                    this.dimensions.length += shape.displayDimensions.length;
                    this.dimensions.width = Math.max(shape.displayDimensions.width, this.dimensions.width);
                    this.dimensions.height = Math.max(shape.displayDimensions.height, this.dimensions.height);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (this.shapes.length > 1) {
                this.dimensions.length += (this.shapes.length - 1) * this.separator;
            }
        }
    }, {
        key: "_positionShapes",
        value: function _positionShapes() {
            var firstFreePosition = -(this.dimensions.length / 2);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.shapes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var shape = _step2.value;

                    shape.position.x = firstFreePosition + shape.displayDimensions.length / 2;
                    shape.position.y = this._alignOnXAxis(shape.displayDimensions.width);

                    firstFreePosition += shape.displayDimensions.length + this.separator;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "_alignOnXAxis",
        value: function _alignOnXAxis(shapeWidth) {
            var p = this.isMirrored ? this.dimensions.width - shapeWidth : shapeWidth - this.dimensions.width;
            return p / 2;
        }
    }]);

    return RowContainer;
}(MirrorContainer);

module.exports = RowContainer;
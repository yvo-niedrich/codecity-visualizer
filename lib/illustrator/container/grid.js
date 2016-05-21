"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MirrorContainer = require("./base-mirror.js");
var Strip = require("./helper/strip.js");
var Cuboid = require("../components/cuboid.js");

/**
 * Rows Elements one after the other
 *
 * @todo seperator-attribut!
 * 
 * @implements MirrorContainer
 * @implements BaseContainer
 * @implements BaseShape
 */

var GridContainer = function (_MirrorContainer) {
    _inherits(GridContainer, _MirrorContainer);

    function GridContainer(key) {
        var mirror = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, GridContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GridContainer).call(this, key, mirror));

        _this._shapes = [];
        _this._strips = [];
        _this._activeStrip = -1;
        _this._optimalAspectRatio = 1.0;
        return _this;
    }

    _createClass(GridContainer, [{
        key: "add",
        value: function add(shape) {
            this._shapes.push(shape);
        }
    }, {
        key: "_finalize",
        value: function _finalize() {
            _get(Object.getPrototypeOf(GridContainer.prototype), "_finalize", this).call(this);

            if (!this._shapes.length) {
                return;
            }

            this._createNewStrip();
            this._activeStrip = 0;

            this._calculateGrid();
            this._calcualteFinalDimensions();
            this._positionStrips();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._strips[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var s = _step.value;

                    _get(Object.getPrototypeOf(GridContainer.prototype), "add", this).call(this, s.container);
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
        }
    }, {
        key: "_calculateGrid",
        value: function _calculateGrid() {
            while (this._shapes.length) {
                var strip = this._strips[this._activeStrip];
                var shape = this._shapes.shift();

                // 1) If a new Strip was just created, add the shape
                //    And then return the pointer to the first strip
                if (!strip.dimensions.length) {
                    strip.add(shape);
                    this._activeStrip = 0;
                    continue;
                }

                // 2) Will the new shape impare the aspect ratio?
                var currentDimensions = this._getCurrentDimensions();
                var newLength = strip.dimensions.length + shape.displayDimensions.length;
                if (newLength / currentDimensions.width > this._optimalAspectRatio) {
                    // 2.1) Inserting the Shape would impare aspect ratio
                    //      Try again on the next strip

                    // If this is the last strip, create a new strip
                    if (this._activeStrip + 1 === this._strips.length) {
                        this._createNewStrip();
                    }

                    this._shapes.unshift(shape);
                    this._activeStrip++;
                } else {
                    // 2.2) The Shape will not impair the aspect ratio on
                    //    the current strip. Insert the shape.
                    var updateOffsets = strip.add(shape);

                    if (updateOffsets) {
                        this._recalculateStripOffsets();
                    }
                }
            }
        }
    }, {
        key: "_createNewStrip",
        value: function _createNewStrip() {
            var rowName = this.key + '_r' + this._strips.length;
            this._strips.push(new Strip(rowName, this.isMirrored));
            this._recalculateStripOffsets();
        }
    }, {
        key: "_recalculateStripOffsets",
        value: function _recalculateStripOffsets() {
            var offset = 0;
            for (var i = 0; i < this._strips.length; i++) {
                this._strips[i].offset = offset;
                offset += this._strips[i].dimensions.width;
            }
        }
    }, {
        key: "_getCurrentDimensions",
        value: function _getCurrentDimensions() {
            var d = new Cuboid();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._strips[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var s = _step2.value;

                    d.length = Math.max(d.length, s.dimensions.length);
                    d.width += s.dimensions.width;
                    d.height = Math.max(d.height, s.dimensions.height);
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

            return d;
        }
    }, {
        key: "_calcualteFinalDimensions",
        value: function _calcualteFinalDimensions() {
            var d = this._getCurrentDimensions();
            this.dimensions.length = d.length;
            this.dimensions.width = d.width;
            this.dimensions.height = d.height;
        }
    }, {
        key: "_positionStrips",
        value: function _positionStrips() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._strips[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var strip = _step3.value;

                    strip.container.position.x = (strip.dimensions.length - this.dimensions.length) / 2;
                    strip.container.position.y = this._calcuateYAxisPosition(strip.offset, strip.dimensions.width);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: "_calcuateYAxisPosition",
        value: function _calcuateYAxisPosition(offset, width) {
            var rowPosOffset = offset + width / 2;
            var origin = this.dimensions.width / 2;

            return this.isMirrored ? origin - rowPosOffset : rowPosOffset - origin;
        }
    }]);

    return GridContainer;
}(MirrorContainer);

;

module.exports = GridContainer;
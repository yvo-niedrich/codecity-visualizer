"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MirrorContainer = require("./base-mirror.js");
var Lighttree = require("./helper/lighttree.js");
var Cuboid = require("../components/cuboid.js");
var Point = require("../components/point.js");

/**
 * Rows Elements one after the other
 *
 * @todo seperator-attribut!
 * 
 * @implements MirrorContainer
 * @implements BaseContainer
 * @implements BaseShape
 */

var Lightmap = function (_MirrorContainer) {
    _inherits(Lightmap, _MirrorContainer);

    function Lightmap(key) {
        var mirror = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, Lightmap);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Lightmap).call(this, key, mirror));

        _this._optimalAspectRatio = 1.0;
        _this._currentDimensions = null;
        _this._cutHorizontal = true;
        return _this;
    }

    _createClass(Lightmap, [{
        key: "_finalize",
        value: function _finalize() {
            _get(Object.getPrototypeOf(Lightmap.prototype), "_finalize", this).call(this);

            if (!this.size) {
                return;
            }
            this._currentDimensions = new Cuboid();

            var shapes = this.shapes;

            if (this._cutHorizontal) {
                shapes.sort(function (a, b) {
                    return b.displayDimensions.width - a.displayDimensions.width;
                });
            } else {
                shapes.sort(function (a, b) {
                    return b.displayDimensions.length - a.displayDimensions.length;
                });
            }

            var origin = new Point();
            var worstDimensions = new Cuboid();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.shapes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var shape = _step.value;

                    worstDimensions.length += Math.ceil(shape.displayDimensions.length);
                    worstDimensions.width += Math.ceil(shape.displayDimensions.width);
                    worstDimensions.height = Math.max(shape.displayDimensions.height, worstDimensions.height);
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

            var tree = new Lighttree(origin, worstDimensions);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.shapes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var s = _step2.value;

                    this._addShapeToTree(s, tree);
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

            this._calcualteFinalDimensions();
            this._positionShapes(tree);
        }
    }, {
        key: "_addShapeToTree",
        value: function _addShapeToTree(shape, tree) {
            var shapeDimensions = shape.displayDimensions;
            var candidates = [];
            tree.collectCandidates(candidates, shapeDimensions);

            // Find the best possible Candidate
            //
            // Preserver => If possible preserve the current Dimensions and
            //              choose the candidate, that would be the most perfect fit
            //
            // Expander => If an Expansion is required, prefer the candidate that would result
            //             in the best aspect ratio
            var bestPossibleRatio = Infinity;
            var bestPossibleSpace = Infinity;
            var expander = null;
            var preserver = null;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = candidates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var c = _step3.value;

                    var newLength = Math.max(c.origin.x + shapeDimensions.length, this._currentDimensions.length);
                    var newWidth = Math.max(c.origin.y + shapeDimensions.width, this._currentDimensions.width);

                    var canPreserveDimensions = newLength === this._currentDimensions.length && newWidth === this._currentDimensions.width;

                    if (preserver && !canPreserveDimensions) {
                        continue;
                    }

                    if (canPreserveDimensions) {
                        var candidateLength = Math.min(c.dimensions.length, this._currentDimensions.length - c.origin.x);
                        var candidateWidth = Math.min(c.dimensions.width, this._currentDimensions.width - c.origin.y);
                        var wastedSpace = candidateWidth * candidateLength - shapeDimensions.length * shapeDimensions.width;

                        if (wastedSpace < bestPossibleSpace) {
                            bestPossibleSpace = wastedSpace;
                            preserver = c;
                        }
                    } else {
                        var candidatesAspectRatio = Math.max(newLength, newWidth) / Math.min(newLength, newWidth);

                        if (candidatesAspectRatio < bestPossibleRatio) {
                            bestPossibleRatio = candidatesAspectRatio;
                            expander = c;
                        }
                    }
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

            var winner = preserver ? preserver : expander;

            // Insert Shape into the candidate and update current dimensions
            winner.insert(shapeDimensions, shape, this._cutHorizontal);
            this._currentDimensions.length = Math.max(winner.origin.x + shapeDimensions.length, this._currentDimensions.length);
            this._currentDimensions.width = Math.max(winner.origin.y + shapeDimensions.width, this._currentDimensions.width);
            this._currentDimensions.height = Math.max(winner.origin.z + shapeDimensions.height, this._currentDimensions.height);
        }
    }, {
        key: "_calcualteFinalDimensions",
        value: function _calcualteFinalDimensions() {
            this.dimensions.length = this._currentDimensions.length;
            this.dimensions.width = this._currentDimensions.width;
            this.dimensions.height = this._currentDimensions.height;
        }
    }, {
        key: "_positionShapes",
        value: function _positionShapes(tree) {
            var containers = [];
            tree.collectNodesWithContent(containers);

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = containers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var node = _step4.value;

                    var shape = node.content;

                    var relativeYPos = node.origin.y + shape.displayDimensions.width / 2;
                    var containerYCentroid = this.dimensions.width / 2;

                    shape.position.x = node.origin.x + (shape.displayDimensions.length - this.dimensions.length) / 2;
                    shape.position.y = this.isMirrored ? containerYCentroid - relativeYPos : relativeYPos - containerYCentroid;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }]);

    return Lightmap;
}(MirrorContainer);

;

module.exports = Lightmap;
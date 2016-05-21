"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseShape = require("../shapes/base.js");

/**
 * A Shape-Container stores shapes and place them (relative to the containers origin).
 * The container will automaticly finalize, once it is drawn or it's dimensions are requested.
 * 
 * @implements BaseShape
 * @interface
 */

var BaseContainer = function (_BaseShape) {
    _inherits(BaseContainer, _BaseShape);

    function BaseContainer(key) {
        _classCallCheck(this, BaseContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseContainer).call(this, key));

        _this._elements = [];
        _this._finalized = false;
        return _this;
    }

    _createClass(BaseContainer, [{
        key: "_finalize",


        /**
         * No more Shapes will be added to the Container. Place the available shapes,
         * and calculate the containers final dimensions
         */
        value: function _finalize() {}
    }, {
        key: "add",


        /**
         * Add a shape to the container
         * @param {BaseShape} shape
         */
        value: function add(shape) {
            this._elements.push(shape);
        }
    }, {
        key: "getSpatialInformation",


        /**
         * Get the spatial information for container and it's content
         * @return {Array}
         */
        value: function getSpatialInformation() {
            var result = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var shape = _step.value;

                    result = result.concat(shape.getSpatialInformation());
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

            return result;
        }
    }, {
        key: "draw",


        /**
         * Draws the container and all of it's shapes (after initiating _finalizeOnce)
         * @param  {Point} parentPosition
         * @param  {int}   parentRotation
         */
        value: function draw(parentPosition, parentRotation) {
            this._finalizeOnce();
            _get(Object.getPrototypeOf(BaseContainer.prototype), "draw", this).call(this, parentPosition, parentRotation);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var shape = _step2.value;

                    shape.draw(this._absolutePosition, this._absoluteRotation);
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

        /**
         * Get the containers dimensions (after initiating _finalizeOnce)
         * @return {Cuboid}
         */

    }, {
        key: "_finalizeOnce",


        /**
         * Will initiate the finalization (if it has not been called already)
         */
        value: function _finalizeOnce() {
            if (!this._finalized) {
                this._finalize();
            }

            this._finalized = true;
        }
    }, {
        key: "size",


        /**
         * Get the amount of elements, this container will draw
         * @return {int}
         */
        get: function get() {
            return this._elements.length;
        }
    }, {
        key: "shapes",


        /**
         * Get all shapes of this container
         * @return {Array}
         */
        get: function get() {
            return this._elements;
        }
    }, {
        key: "displayDimensions",
        get: function get() {
            this._finalizeOnce();
            return _get(Object.getPrototypeOf(BaseContainer.prototype), "displayDimensions", this);
        }
    }]);

    return BaseContainer;
}(BaseShape);

module.exports = BaseContainer;
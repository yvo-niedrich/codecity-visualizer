"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cuboid = require("../components/cuboid.js");
var Point = require("../components/point.js");
/**
 * All shapes occupy a square area.
 * It's dimensions are described by the vector `dimensions`.
 * It can be placed and rotated around the shapes centroid.
 * 
 * @interface
 */

var BaseShape = function () {
    function BaseShape(key) {
        _classCallCheck(this, BaseShape);

        this._key = String(key);

        this._hasBeenDrawn = false;
        this._absolutePosition = null;
        this._absoluteRotation = 0;

        this._attributes = {
            key: key,
            dimensions: new Cuboid(),
            position: new Point(),
            rotation: 0,
            margin: 0
        };
    }

    _createClass(BaseShape, [{
        key: "rotate",


        /**
         * Rotation the shape around the it's centroid.
         * @param  {int} degrees clockwise rotation
         */
        value: function rotate(degrees) {
            if (degrees % 90) {
                throw 'Only 90° rotations allowed';
            }

            this._attributes.rotation = (720 + this.rotation + degrees) % 360;
        }
    }, {
        key: "draw",


        /**
         * Draw the Shape (calculate final absolute position and rotation)
         * @param  {Point} parentPosition
         * @param  {int}   parentRotation [description]
         */
        value: function draw(parentPosition, parentRotation) {
            var a = (720 - parentRotation) % 360;
            var rad = a * (Math.PI / 180);
            var transformedRelativePosition = new Point(Math.cos(rad) * this.position.x - Math.sin(rad) * this.position.y, Math.sin(rad) * this.position.x + Math.cos(rad) * this.position.y, this.position.z);

            this._absolutePosition = new Point(parentPosition.x + transformedRelativePosition.x, parentPosition.y + transformedRelativePosition.y, parentPosition.z + transformedRelativePosition.z);

            this._absoluteRotation = (360 + parentRotation + this.rotation) % 360;

            this._hasBeenDrawn = true;
        }
    }, {
        key: "getSpatialInformation",


        /**
         * Draw the Shape
         * @return {Object}
         */
        value: function getSpatialInformation() {
            if (!this._hasBeenDrawn) {
                throw 'Node has not been drawn yet';
            }

            var swap = this._absoluteRotation % 180;
            var rotatedDimensions = new Cuboid(swap ? this.dimensions.width : this.dimensions.length, swap ? this.dimensions.length : this.dimensions.width, this.dimensions.height);

            var spatialInformation = {};
            Object.assign(spatialInformation, this._attributes);

            spatialInformation.dimensions = rotatedDimensions;
            spatialInformation.position = this._absolutePosition;
            spatialInformation.rotation = this._absoluteRotation;

            return [spatialInformation];
        }
    }, {
        key: "updateAttributes",


        /**
         * Updates the internal Attributes for the SpatialInformation.
         * Also applies Spatial Data for this Shape directly.
         * @param  {Object} attributes
         */
        value: function updateAttributes(attributes) {
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    var value = attributes[key];
                    this._updateAttribute(this._attributes, key.split('.'), value);
                }
            }
        }
    }, {
        key: "_updateAttribute",
        value: function _updateAttribute(obj, keys, value) {
            var k = keys.shift();
            if (!keys.length) {
                obj[k] = value;
            } else {
                if (!(k in obj)) {
                    obj[k] = {};
                }
                this._updateAttribute(obj[k], keys, value);
            }
        }
    }, {
        key: "getAttribute",
        value: function getAttribute(key) {
            var keys = key.split('.');
            var attr = this._attributes;
            while (keys.length && (attr = attr[keys.shift()])) {}
            return attr;
        }
    }, {
        key: "key",


        /**
         * The shapes (and it's associated model nodes) identifier
         * @return {String}
         */
        get: function get() {
            return this._key;
        }
    }, {
        key: "margin",


        /**
         * Set the margin for this Shape
         * @param  {int} margin
         */
        set: function set(margin) {
            this._attributes.margin = margin;
        },


        /**
         * Set the margin for this Shape
         * @param  {int} margin
         */
        get: function get() {
            return this._attributes.margin;
        }

        /**
         * Get this shapes position, relative to it's parents centroid
         * @return {Point}
         */

    }, {
        key: "position",
        get: function get() {
            return this._attributes.position;
        }

        /**
         * Get the Shape's qubic cuboidments (before any rotation)
         * @return {Cuboid}
         */

    }, {
        key: "dimensions",
        get: function get() {
            return this._attributes.dimensions;
        }
    }, {
        key: "displayDimensions",


        /**
         * Get the shape's qubic cuboidments
         * @return {Cuboid}
         */
        get: function get() {
            var swap = this.rotation % 180;
            var l = this.dimensions.length + 2 * this.margin;
            var w = this.dimensions.width + 2 * this.margin;
            var h = this.dimensions.height + 2 * this.margin;
            return new Cuboid(swap ? w : l, swap ? l : w, h);
        }
    }, {
        key: "centroid",


        /**
         * Get the shapes centroid (with relative rotation)
         * @return {Point}
         */
        get: function get() {
            return new Point(this.displayDimensions.length / 2, this.displayDimensions.width / 2);
        }
    }, {
        key: "rotation",


        /**
         * Get the relative rotation
         * @return {int}
         */
        get: function get() {
            return this._attributes.rotation;
        }
    }]);

    return BaseShape;
}();

module.exports = BaseShape;
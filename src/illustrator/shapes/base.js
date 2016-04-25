var Measure = require("../components/measure.js");
var Point   = require("../components/point.js");
/**
 * All shapes occupy a square area.
 * It's dimensions described by the vector `dimensions`.
 * It can be placed on and rotated around the shapes centroid.
 * 
 * @interface
 */
class BaseShape {
    constructor(key) {
        this._key = String(key);
        this._dimensions = new Measure(0, 0);
        this._relativePosition = new Point();
        this._rotation = 0;
        this._marginH = 0;
        this._marginV = 0;

        this._hasBeenDrawn = false;
        this._absolutePosition = null;
        this._absoluteRotation = 0;

        this._attributes = {
            key: key,
            position: new Point(),
            rotation: 0,
            dimensions: new Measure(0, 0),
            height: 1
        }
    };

    /**
     * The shapes (and it's associated model nodes) identifier
     * @return {String}
     */
    get key() {
        return this._key;
    };

    /**
     * Set the margin for this Shape
     * @param  {int} margin
     */
    set margin(margin) {
        this._marginH = margin;
        this._marginV = margin;
    }

    /**
     * Set the horizontal margin for this Shape (does not increase width)
     * @param  {int} margin
     */
    set marginHorizontal(margin) {
        this._marginH = margin;
    }

    /**
     * Set the vertical margin for this Shape (does not increase length)
     * @param  {int} margin
     */
    set marginVertical(margin) {
        this._marginV = margin;
    }

    /**
     * Get this shapes position, relative to it's parents centroid
     * @return {Point}
     */
    get relativePosition() {
        return this._relativePosition;
    }

    /**
     * Get the Shape's qubic measurements (before any rotation)
     * @return {Measure}
     */
    get dimensions() {
        return this._dimensions;
    };

    /**
     * Get the shape's qubic measurements
     * @return {Measure}
     */
    get displayDimensions() {
        var swap = this.rotation % 180;
        var l = this._dimensions.length + 2 * this._marginH;
        var w = this._dimensions.width + 2 * this._marginV;
        return new Measure(
            swap ? w  : l,
            swap ? l : w
        );
    };

    /**
     * Get the shapes centroid (with relative rotation)
     * @return {Point}
     */
    get centroid () {
        return new Point(
            this.displayDimensions.length / 2,
            this.displayDimensions.width / 2
        );
    };

    /**
     * Get the relative rotation
     * @return {int}
     */
    get rotation() {
        return this._rotation;
    };

    /**
     * Rotation the shape around the it's centroid.
     * @param  {int} degrees clockwise rotation
     */
    rotate(degrees){
        if (degrees % 90) {
            throw 'Only 90° rotations allowed'
        }

        this._rotation = (360 + degrees) % 360;
    };

    /**
     * Draw the Shape (calculate final absolute position and rotation)
     * @param  {Point} parentPosition
     * @param  {int}   parentRotation [description]
     */
    draw(parentPosition, parentRotation) {
        var a = (720 - parentRotation) % 360;
        var rad = a * (Math.PI / 180);
        var transformedRelativePosition = new Point(
            Math.cos(rad) * this.relativePosition.x - Math.sin(rad) * this.relativePosition.y,
            Math.sin(rad) * this.relativePosition.x + Math.cos(rad) * this.relativePosition.y
        );

        this._absolutePosition = new Point(
            parentPosition.x + transformedRelativePosition.x,
            parentPosition.y + transformedRelativePosition.y
        );

        this._absoluteRotation = (360 + parentRotation + this.rotation) % 360;

        this._hasBeenDrawn = true;
    };

    /**
     * Draw the Shape
     * @return {Object}
     */
    getSpatialInformation() {
        if (!this._hasBeenDrawn) {
            throw 'Node has not been drawn yet';
        }

        var swap = this._absoluteRotation % 180;
        var rotatedDimensions = new Measure(
            swap ? this.dimensions.width  : this.dimensions.length,
            swap ? this.dimensions.length : this.dimensions.width
        );

        this._attributes.position.x += this._absolutePosition.x;
        this._attributes.position.y += this._absolutePosition.y;
        this._attributes.rotation = this._absoluteRotation;
        this._attributes.dimensions.length = rotatedDimensions.length;
        this._attributes.dimensions.width = rotatedDimensions.width;

        return this._attributes;
    };

    updateAttributes(attributes) {
        Object.assign(this._attributes, attributes);
    }
}

module.exports = BaseShape;

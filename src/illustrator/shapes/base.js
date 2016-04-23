var Measure = require("../geometry/measure.js");
var Point   = require("../geometry/point.js");
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
        this._relativePosition = new Point(0, 0);
        this._rotation = 0;
        this._marginH = 0;
        this._marginV = 0;
    };

    get key() {
        return this._key;
    };

    set margin(margin) {
        this._marginH = margin;
        this._marginV = margin;
    }

    set marginHorizontal(margin) {
        this._marginH = margin;
    }

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
     * Get the Shape's qubic size
     * @return {Measure}
     */
    get dimensions() {
        return this._dimensions;
    };

    /**
     * Get the shape's qubic size (after possible rotations)
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
     * Get the shapes centroid
     * @return {Point}
     */
    get centroid () {
        return new Point(
            this.displayDimensions.length / 2,
            this.displayDimensions.width / 2
        );
    };

    /**
     * Get the 
     * @return {[type]} [description]
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
     * Draw the Shape
     * @TODO: Type?!?
     * @param  {Point} parentPosition [description]
     * @param  {int}   parentRotation [description]
     * @return {[type]}                [description]
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

        return null;
    };
}

module.exports = BaseShape;

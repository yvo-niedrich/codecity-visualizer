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
        this._dimension = new Measure(0, 0);
        this._rotation = 0;
        this._absolutePosition = null;
    };

    get key() {
        return this._key;
    };

    // TODO: dimensions vs. displayDimension
    get centroid () {
        return new Point(this.dimensions.length / 2, this.dimensions.width / 2);
    };

    /**
     * Get the Shape's qubic size
     * @return {Measure}
     */
    get dimensions() {
        return this._dimension;
    };

    /**
     * Get the shape's qubic size (after possible rotations)
     * @return {Measure}
     */
    get displayDimension() {
        var swap = this.rotation % 180;
        return new Measure(
            swap ? this._dimension.width  : this.dimensions.length,
            swap ? this._dimension.length : this.dimensions.width
            );
    };

    /**
     * Set the absolute Position for this shapes centroid, to place it in the scene
     * @param  {Point} coordinates
     */
    set absolute(point) {
        this._absolutePosition = point;
    };

    /**
     * Get shapes centroid-position, to draw it in the scene
     * @param  {Point} coordinates
     */
    get absolute() {
        return this._absolutePosition;
    };

    /**
     * Set the rotation around the shapes centroid.
     * @param  {int} degrees clockwise rotation
     *
     * http://www.hinterseher.de/Diplomarbeit/Transformation.html
     */
    set rotation(degrees){
        if (degrees % 90) {
            throw 'Only 90° rotations allowed'
        }

        this._rotation = 360 + degrees % 360;
    };

    /**
     * Get the 
     * @return {[type]} [description]
     */
    get rotation() {
        return this._rotation;
    };

    draw() {};
}

module.exports = BaseShape;

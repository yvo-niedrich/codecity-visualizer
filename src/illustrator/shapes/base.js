var Cuboid = require("../components/cuboid.js");
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

        this._hasBeenDrawn = false;
        this._absolutePosition = null;
        this._absoluteRotation = 0;

        this._attributes = {
            dimensions: new Cuboid(0, 0),
            relativePosition: new Point(),
            rotation: 0,
            margin: 0
        };

        this._informations = {
            key: key,
            position: new Point(),
            rotation: 0,
            dimensions: new Cuboid(0, 0),
            height: 1
        };
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
        this._attributes.margin = margin;
    };

    /**
     * Set the margin for this Shape
     * @param  {int} margin
     */
    get margin() {
        return this._attributes.margin;
    }

    /**
     * Get this shapes position, relative to it's parents centroid
     * @return {Point}
     */
    get relativePosition() {
        return this._attributes.relativePosition;
    }

    /**
     * Get the Shape's qubic cuboidments (before any rotation)
     * @return {Cuboid}
     */
    get dimensions() {
        return this._attributes.dimensions;
    };

    /**
     * Get the shape's qubic cuboidments
     * @return {Cuboid}
     */
    get displayDimensions() {
        var swap = this.rotation % 180;
        var l = this.dimensions.length + 2 * this.margin;
        var w = this.dimensions.width  + 2 * this.margin;
        return new Cuboid(
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
        return this._attributes.rotation;
    };

    /**
     * Rotation the shape around the it's centroid.
     * @param  {int} degrees clockwise rotation
     */
    rotate(degrees){
        if (degrees % 90) {
            throw 'Only 90° rotations allowed'
        }

        this._attributes.rotation = (360 + degrees) % 360;
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
        var rotatedDimensions = new Cuboid(
            swap ? this.dimensions.width  : this.dimensions.length,
            swap ? this.dimensions.length : this.dimensions.width
        );

        this._informations.position.x += this._absolutePosition.x;
        this._informations.position.y += this._absolutePosition.y;
        this._informations.rotation = this._absoluteRotation;
        this._informations.dimensions.length = rotatedDimensions.length;
        this._informations.dimensions.width = rotatedDimensions.width;

        return this._informations;
    };

    /**
     * Updates the internal Attributes for the SpatialInformation.
     * Also applies Spatial Data for this Shape directly.
     * @param  {Object} attributes
     */
    updateAttributes(attributes) {
        Object.assign(this._informations, attributes);

        if ('dimensions' in attributes) {
            if ('length' in attributes.dimensions) {
                this.dimensions.length = attributes.dimensions.length;
            }

            if ('width' in attributes.dimensions) {
                this.dimensions.width = attributes.dimensions.width;
            }
        }

        if ('margin' in attributes) {
            this.margin = attributes.margin;
        }
    }
}

module.exports = BaseShape;

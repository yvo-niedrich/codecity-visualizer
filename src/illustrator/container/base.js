/* eslint no-unused-vars: "off" */

var BaseShape = require("../shapes/base.js");
var ConfigurableInterface = require('../interfaces/configurable.js');

/**
 * A Shape-Container stores shapes and place them (relative to the containers origin).
 * The container will automatically finalize, once it is drawn or it's dimensions are requested.
 *
 * @implements Configurable
 */
class BaseContainer extends BaseShape {
    constructor(key) {
        super(key);
        this._elements = [];
        this._finalized = false;
    }

    /**
     * No more Shapes will be added to the Container. Place the available shapes,
     * and calculate the containers final dimensions
     * @abstract
     */
    finalize() { }

    /**
     * Add a shape to the container
     * @param {BaseShape} shape
     */
    add(shape) {
        this._elements.push(shape);
    }

    /**
     * Get the amount of elements, this container will draw
     * @return {int}
     */
    get size() {
        return this._elements.length;
    }

    /**
     * Get all shapes of this container
     * @return {Array}
     */
    get shapes() {
        return this._elements;
    }

    /**
     * Get the spatial information for container and it's content
     * @return {Array}
     */
    getSpatialInformation() {
        var result = [];
        for (var shape of this._elements) {
            result = result.concat(shape.getSpatialInformation());
        }
        return result;
    }

    /**
     * Draws the container and all of it's shapes (after initiating _finalizeOnce)
     * @param  {Point}  parentPosition
     * @param  {number} parentRotation
     */
    draw(parentPosition, parentRotation) {
        this._finalizeOnce();
        super.draw(parentPosition, parentRotation);

        for (var shape of this._elements) {
            shape.draw(this._absolutePosition, this._absoluteRotation);
        }
    }

    /**
     * Get the containers dimensions (after initiating _finalizeOnce)
     * @return {Cuboid}
     */
    get displayDimensions() {
        this._finalizeOnce();
        return super.displayDimensions;
    }

    /**
     * Will initiate the finalization (if it has not been called already)
     */
    _finalizeOnce() {
        if (!this._finalized) {
            this.finalize();
        }

        this._finalized = true;
    }
}


module.exports = ConfigurableInterface(BaseContainer);

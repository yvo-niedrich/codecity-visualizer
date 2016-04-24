var BaseShape = require("../shapes/base.js");

/**
 * A Shape-Container
 * Will store shapes and place them (relative to the containers origin).
 * A Shape-Container also implements the BaseShape-Interface
 * 
 * @implements BaseShape
 * @interface
 */
class BaseContainer extends BaseShape {
    constructor(key) {
        super(key);
        this._elements = [];
    };

    /**
     * Get the amount of elements in this container will draw
     * @return {int}
     */
    get count() {
        return this._elements.length;
    };

    /**
     * Add a shape to the container's category
     * @param {BaseShape} shape
     */
    add(shape) {
        this._elements.push(shape);
    };

    /**
     * Get all shapes of this container
     * @return {Array}
     */
    get shapes() {
        return this._elements;
    };

    /**
     * Draws the container and all of it's shapes
     * @param  {Point} parentPosition
     * @param  {int}   parentRotation
     */
    draw(parentPosition, parentRotation) {
        super.draw(parentPosition, parentRotation);

        for (var shape of this._elements) {
            shape.draw(this._absolutePosition, this._absoluteRotation);
        }
    }

    /**
     * Get the spatial information for container and it's content
     * @return {Array} [description]
     */
    getSpatialInformation() {
        var result = [];
        for (var shape of this._elements) {
            result = result.concat(shape.getSpatialInformation());
        }
        return result;
    };

    /**
     * No more Shapes will be added to the Container. Place the available shapes,
     * and calculate the containers final dimensions
     * @TODO: Design -  Can i get rid of this?
     */
    finalize() {};
}

module.exports = BaseContainer;

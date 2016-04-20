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
    }

    /**
     * Add a shape to the container
     * @param {BaseShape} shape The new Shape
     */
    add(shape) {};

    /**
     * No more Shapes will be added to the Container. Place the available shapes,
     * and calculate the containers final dimensions
     */
    finalize() {};
}

module.exports = BaseContainer;

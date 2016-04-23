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

    get count() {
        return this._elements.length;
    }

    /**
     * Add a shape to the container's category
     * @param {BaseShape} shape The new Shape
     */
    add(shape) {
        this._elements.push(shape);
    };

    get shapes() {
        return this._elements;
    }

    draw(parentPosition, parentRotation) {
        // TODO
        super.draw(parentPosition, parentRotation);

        var result = [];
        for (var shape of this._elements) {
            result = result.concat(shape.draw(this._absolutePosition, this._absoluteRotation));
        }
        return result;
    };

    /**
     * No more Shapes will be added to the Container. Place the available shapes,
     * and calculate the containers final dimensions
     */
    finalize() {};
}

module.exports = BaseContainer;

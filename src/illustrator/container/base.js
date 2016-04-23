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
        this._categories = {};
        this._elementCount = 0;
    };

    get count() {
        return this._elementCount;
    }

    /**
     * Add a shape to the container's category
     * @param {BaseShape} shape The new Shape
     */
    add(shape, category = '_default') {
        if (!this._categories[category]) {
            this._categories[category] = [];
        }

        this._categories[category].push(shape);
        this._elementCount++;
    };

    getShapes(category = '_default') {
        return this._categories[category] ? this._categories[category] : [];
    }

    /**
     * No more Shapes will be added to the Container. Place the available shapes,
     * and calculate the containers final dimensions
     */
    finalize() {};
}

module.exports = BaseContainer;

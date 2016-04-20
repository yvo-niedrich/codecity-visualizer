var BaseContainer = require("./base.js");
var ShapeHouse    = require("../shapes/house.js");

/**
 * Rows Elements one after the other
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class RowContainer extends BaseContainer {
    constructor(key) {
        super(key);
        this._shapes   = [];
        this._length = 0;
        this._width  = 0;
    };

    _updateDimensions(newShapeDimensions) {
        this.dimensions.length = Math.max(newShapeDimensions.x, this._width);
        this.dimensions.width  += newShapeDimensions.width;
    }

    add(shape) {
        this._shapes.push(shape);
        this._updateDimensions(shape.dimensions)

    };

    finalize() {
        if (!this._shapes.length) {
            return;
        }

        // @TODO: Calculate Shapes coordinates, relative to the containers centriod
    };

    draw() {};
}

module.exports = RowContainer;

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
    };

    _updateDimensions(newShapeDimensions) {
        this.dimensions.length  = Math.max(newShapeDimensions.length, this.dimensions.length);
        this.dimensions.width  += newShapeDimensions.width;
    }

    add(shape) {
        this._shapes.push(shape);
        this._updateDimensions(shape.displayDimensions)

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

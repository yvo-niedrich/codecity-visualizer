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
    }

    add(shape) {
        this._shapes.push(shape);
        
        var d = shape.dimensions;
        this._length = Math.max(d.x, this._width);
        this._width += d.y;
    };

    finalize() {
        if (!this._shapes.length) {
            return;
        }

        // @TODO: Calculate Shapes coordinates, relative to the containers centriod
    };

    get dimensions() {
        return {
            x: this._length,
            y: this._width
        }
    };
    set size(val) {};
    set absoluteX(x) {};
    set absoluteY(y) {};
    set rotation(degrees){};
    draw() {};
}

module.exports = RowHouseContainer;

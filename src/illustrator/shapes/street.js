var BaseShape = require("./base.js");

/**
 * Draw a Street
 * 
 * @implements BaseShape
 */
class Street extends BaseShape {
    constructor(key) {
        super(key);
        this._margin_x = 0;
        this._margin_y = 0;
        this._width    = 10;
        this._length   = 10;

        this._updateDimensions();
    };

    _updateDimensions() {
        this.dimensions.length = this._length + (2 * this._margin_y);
        this.dimensions.width  = this._width  + (2 * this._margin_x);
    };

    set length(length) {
        this._length = length;
        this._updateDimensions();
    };

    set width(width) {
        this._width = width;
        this._updateDimensions();
    };

    draw() {
        throw 'not yet implemented'
    };
}

module.exports = Street;

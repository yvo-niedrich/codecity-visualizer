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
        this.dimensions.length = 22;
        this.dimensions.width  = 10;
    };

    draw(parentPosition, parentRotation) {
        // TODO
        super.draw(parentPosition, parentRotation);

        return this._drawMe();
    };
}

module.exports = Street;

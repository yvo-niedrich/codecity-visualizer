var BaseShape = require("./base.js");
var Measure   = require("../geometry/measure.js");

/**
 * Draw a Street
 * 
 * @implements BaseShape
 */
class Street extends BaseShape {
    constructor(key) {
        super(key);
    };

    draw(parentPosition, parentRotation) {
        // TODO
        super.draw(parentPosition, parentRotation);
        return this._drawMe();
    }

    _drawMe() {
        var swap = this._absoluteRotation % 180;
        return {
            key: this.key,
            pos: this._absolutePosition,
            size: new Measure(
                swap ? this.dimensions.width  : this.dimensions.length,
                swap ? this.dimensions.length : this.dimensions.width
            ),
            color: 0x156289,
            height: 1
        }
    }
}

module.exports = Street;

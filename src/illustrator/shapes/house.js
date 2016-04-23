var BaseShape = require("./base.js");
var Measure   = require("../geometry/measure.js");

/**
 * Draw a House
 * 
 * @implements BaseShape
 */
class House extends BaseShape {
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
            color: 0x1A212E,
            height: (Math.floor(Math.random() * (8 - 2 + 1)) + 2) * 4
        }
    }
}

module.exports = House;

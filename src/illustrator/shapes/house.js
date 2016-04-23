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
        this._margin = 4;
        this._house = new Measure(20, 20);
        this._updateDimensions();
    };

    _updateDimensions() {
        this.dimensions.length = this._house.length + (2 * this._margin),
        this.dimensions.width  = this._house.width  + (2 * this._margin)
    };

    set margin(val) {
        this._margin = val;
        this._updateDimensions();
    }

    set size(val) {
        this._house.length = val;
        this._house.width  = val;
        this._updateDimensions();
    };

    draw(parentPosition, parentRotation) {
        // TODO
        super.draw(parentPosition, parentRotation);

        // console.log(this.key, parentPosition);
        return this._drawMe();
    };

    _drawMe() {
        var swap = this._absoluteRotation % 180;
        return {
            key: this.key,
            pos: this._absolutePosition,
            size: new Measure(
                swap ? this._house.width  : this._house.length,
                swap ? this._house.length : this._house.width
            ),
            color: 0x1A212E,
            height: (Math.floor(Math.random() * (8 - 2 + 1)) + 2) * 4
        }
    }
}

module.exports = House;

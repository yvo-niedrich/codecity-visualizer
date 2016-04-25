var BaseShape = require("./base.js");
var Measure   = require("../components/measure.js");

/**
 * Draw a House
 * 
 * @implements BaseShape
 */
class House extends BaseShape {
    constructor(key) {
        super(key);
    };

    getSpatialInformation() {
        var i = super.getSpatialInformation();

        if (!('color' in i)) {
            i.color = 0x1A212E;
        }

        if (!('height' in i)) {
            i.height = 1;
        }

        return i;
    };
}

module.exports = House;

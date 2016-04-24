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

        i.color = 0x1A212E;
        i.height = (Math.floor(Math.random() * (8 - 2 + 1)) + 2) * 4;

        return i;
    };
}

module.exports = House;

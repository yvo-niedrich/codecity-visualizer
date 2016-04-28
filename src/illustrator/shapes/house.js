var BaseShape = require("./base.js");
var Cuboid   = require("../components/cuboid.js");

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
        var shapes = super.getSpatialInformation();

        for (var shape of shapes) {
            if (!('color' in shape)) {
                shape.color = 0x1A212E;
            }
        }

        return shapes;
    };
}

module.exports = House;

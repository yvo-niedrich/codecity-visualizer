var BaseShape = require("./base.js");
var Cuboid   = require("../components/cuboid.js");

/**
 * Draw a Street
 * 
 * @implements BaseShape
 */
class Street extends BaseShape {
    constructor(key) {
        super(key);
    };

    getSpatialInformation() {
        var shapes = super.getSpatialInformation();

        for (var shape of shapes) {
            if (!('color' in shape)) {
                shape.color = 0x156289;
            }
        }

        return shapes;
    };
}

module.exports = Street;

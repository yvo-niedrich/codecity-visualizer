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
        var i = super.getSpatialInformation();

        i.color = 0x156289;
        i.height = 1;

        return i;
    };
}

module.exports = Street;

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
}

module.exports = Street;

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
}

module.exports = House;

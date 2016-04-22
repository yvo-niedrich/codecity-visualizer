var BaseShape = require("./base.js");
var Street = require("./street.js");

/**
 * Draw a Highway
 * 
 * @implements BaseShape
 * @implements Street
 */
class Highway extends Street {
    constructor(key) {
        super(key);
        this.dimensions.length = 50
    };
}

module.exports = Highway;

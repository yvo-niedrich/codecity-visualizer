var BaseShape = require("./base.js");

/**
 * Draw a House
 * 
 * @implements BaseShape
 */
class House extends BaseShape {
    constructor(key) {
        super(key);
        this._margin = 4;
        this._house = { x: 15, y: 15 };
        this._absolute = { x: 0, y: 0 };
        this._rotation = 0;
    }

    get dimensions() {
        return {
            x: this._house.x + (2 * this._margin),
            y: this._house.y + (2 * this._margin)
        }
    };    

    set size(val) {
        this._house.x = val;
        this._house.y = val;
    }

    set absoluteX(x) {
        this.absolute.x = x;
    };

    set absoluteY(y) {
        this.absolute.y = y;
    };

    set rotation(degrees){
        this._rotation = degrees % 360;
    };

    draw() {
        throw 'not yet implemented'
    };
}

module.exports = House;

var BaseContainer = require("./base.js");
var ShapeHouse    = require("../shapes/house.js");
var ShapeStreet   = require("../shapes/street.js");

/**
 * Create an evostreet city
 *
 * @TODO: Shape-Methods
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class StreetContainer extends BaseContainer {
    constructor(key) {
        super(key);
        this._road     = null;
        this._houses   = [];
        this._branches = [];
    }

    add(shape) {
        if (shape instanceof StreetContainer) {
            this._branches.push(shape);
        } else if (shape instanceof ShapeHouse) {
            this._houses.push(shape);
        } else if (shape instanceof ShapeStreet) {
            if (this._road !== null) {
                throw 'StreetContainer can only have one road.'
            }
            this._road = shape;
        } else {
            throw 'Unknown Shape';
        }
    };

    finalize() {
        // Sort Houses by size
        this._houses.sort(function (a, b) {
            return a.dimensions.x - b.dimensions.x;
        });

        // @TODO
    };

    get dimensions() {};
    set size(val) {};
    set absoluteX(x) {};
    set absoluteY(y) {};
    set rotation(degrees){};
    draw() {};
}

module.exports = StreetContainer;

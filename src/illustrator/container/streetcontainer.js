var BaseContainer = require("./base.js");
var RowContainer  = require("./row.js");
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

        this._final = {
            houses: {
                left:  new RowContainer(key + '_hleft'),
                right: new RowContainer(key + '_hright')
            },
            branches: {
                left:  new RowContainer(key + '_bleft'),
                right: new RowContainer(key + '_bright')
            }
        }
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
        if (this._road === null) {
            throw 'StreetContainer requires a primary street'
        }

        this._addHousesToFinalStructure();
        this._addBranchesToFinalStructure();

        // @TODO
        //  - road length
        //  - position road
        //  - position left house row
        //  - position right house row
        //  - position left branch row
        //  - position right branch row
    };

    _addHousesToFinalStructure() {
        // Sort Houses by size (smallest first)
        this._houses.sort(function (a, b) {
            return a.dimensions.x - b.dimensions.x;
        });

        this._houses.forEach(function(value, key) {
            if (i%2) this._final.houses.left.add(value);
            else     this._final.houses.right.add(value);
        });

        this._final.houses.left.finalize();
        this._final.houses.right.finalize();
    }

    _addBranchesToFinalStructure() {
        // Don't sort branches, as we want to keep them as consistent as possible
        // @TODO: Rotation
        this._branches.forEach(function(value, key) {
            if (i%2) this._final.branches.left.add(value);
            else     this._final.branches.right.add(value);
        });

        this._final.branches.left.finalize();
        this._final.branches.right.finalize();
    }

    get dimensions() {};
    set size(val) {};
    set absoluteX(x) {};
    set absoluteY(y) {};
    set rotation(degrees){};
    draw() {};
}

module.exports = StreetContainer;

var BaseContainer = require("./base.js");
var RowContainer  = require("./row.js");
var ShapeHouse    = require("../shapes/house.js");
var ShapeStreet   = require("../shapes/street.js");

/**
 * Create an evostreet city
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

        this._configuration = {
            initialMargin: 30,
            containerMargin: 30,
            branchRotation: 90
        };

        this._final = {
            houses: {
                left:  new RowContainer(key + '_hleft'),
                right: new RowContainer(key + '_hright')
            },
            branches: {
                left:  new RowContainer(key + '_bleft'),
                right: new RowContainer(key + '_bright')
            }
        };
    };

    _updateDimensions() {
        this.dimensions.length = this._getContainerLength();
        this.dimensions.width  = this._getContainerWidth();
    };

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
        // Sort Houses by size (smallest first), to optimize space
        this._houses.sort(function (a, b) {
            return a.dimensions.length - b.dimensions.length;
        });

        this._houses.forEach(function(house, key) {
            if (key%2) {
                this._final.houses.left.add(house);
            } else {
                this._final.houses.right.add(house);
            }
        }.bind(this));

        this._final.houses.left.finalize();
        this._final.houses.right.finalize();
    };

    _addBranchesToFinalStructure() {
        // Don't sort branches, as we want to keep them consistent over developement
        this._branches.forEach(function(branch, key) {
            if (key%2) {
                branch.rotation = -this._configuration.branchRotation;
                this._final.branches.left.add(branch);
            } else {
                branch.rotation = this._configuration.branchRotation;
                this._final.branches.right.add(branch);
            }
        }.bind(this));

        this._final.branches.left.finalize();
        this._final.branches.right.finalize();
    };

    _getContainerWidth() {
        var lengthHouses = Math.max(this._final.houses.left.dimensions.width, this._final.houses.right.dimensions.width);
        var lengthBranches = Math.max(this._final.branches.left.dimensions.width, this._final.branches.right.dimensions.width);
        return lengthHouses +
                lengthBranches +
                this._configuration.initialMargin +
                lengthBranches && lengthHouses ? this._configuration.containerMargin : 0;
    };

    _getContainerLength() {
        return Math.max(this._final.houses.left.dimensions.length, this._final.branches.left.dimensions.length) +
                this._road.dimensions.length +
                Math.max(this._final.houses.right.dimensions.length, this._final.branches.right.dimensions.length);
    };

    draw() {};
}

module.exports = StreetContainer;

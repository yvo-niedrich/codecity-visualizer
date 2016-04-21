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
                left:  new RowContainer(key + '_hl', RowContainer.ALIGNMENT_RIGHT),
                right: new RowContainer(key + '_hr', RowContainer.ALIGNMENT_LEFT)
            },
            branches: {
                left:  new RowContainer(key + '_bl', RowContainer.ALIGNMENT_RIGHT),
                right: new RowContainer(key + '_br', RowContainer.ALIGNMENT_LEFT)
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
        this._updateDimensions();

        this._road.width = this.dimensions.length;
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
                branch.rotate(-this._configuration.branchRotation);
                this._final.branches.left.add(branch);
            } else {
                branch.rotate(this._configuration.branchRotation);
                this._final.branches.right.add(branch);
            }
        }.bind(this));

        this._final.branches.left.finalize();
        this._final.branches.right.finalize();
    };

    _getContainerWidth() {
        var houseWidth = Math.max(
            this._final.houses.left.displayDimensions.width,
            this._final.houses.right.displayDimensions.width
       );
        var branchWidth = Math.max(
            this._final.branches.left.displayDimensions.width,
            this._final.branches.right.displayDimensions.width
         );
        var containerMargin = (branchWidth && houseWidth) ? this._configuration.containerMargin : 0;

        return houseWidth + branchWidth + this._configuration.initialMargin + containerMargin;
                
    };

    _getContainerLength() {
        var leftLength = Math.max(
            this._final.houses.left.displayDimensions.length,
            this._final.branches.left.displayDimensions.length
        );
        var rightLength = Math.max(
            this._final.houses.right.displayDimensions.length,
            this._final.branches.right.displayDimensions.length
        );
        
        return leftLength + this._road.displayDimensions.length + rightLength;
    };

    draw() {};
}

module.exports = StreetContainer;

var BaseContainer = require("./base.js");
var RowContainer  = require("./row.js");
var ShapeHouse    = require("../shapes/house.js");
var ShapeStreet   = require("../shapes/street.js");
var Point         = require("../geometry/point.js");

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

        this._structure = {
            'road': {
                shape: null
            },
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

        this._addHousesToStructure();
        this._addBranchesToStructure();
        this._updateDimensions();

        this._structure.road = this._road;
        this._structure.road.dimensions.width = this.dimensions.width;
        this._structure.road.relativePosition.x = (this.dimensions.length / 2) - this._getMaxContainerRightLength();
        this._structure.road.relativePosition.y = 0;

        var containersBottom = -(this.dimensions.width / 2) + this._configuration.initialMargin;
        var putRoadBetweenBranches = this._structure.road.displayDimensions.width / 2;

        if (this._branches.length) {
            if (this._structure.branches.left.countElements) {
                this._structure.branches.left.relativePosition.x = - (this._structure.branches.left.centroid.x + putRoadBetweenBranches);
                this._structure.branches.left.relativePosition.y = containersBottom + this._structure.branches.left.centroid.y;
            }

            if (this._structure.branches.right.countElements) {
                this._structure.branches.right.relativePosition.x = this._structure.branches.right.centroid.x + putRoadBetweenBranches;
                this._structure.branches.right.relativePosition.y = containersBottom + this._structure.branches.right.centroid.y;
            }

            containersBottom += this._getMaxBranchContainerWidth() + this._configurationMargin;
        }

        if (this._houses.length) {
            if (this._structure.houses.left.countElements) {
                this._structure.houses.left.relativePosition.x = - (this._structure.houses.left.centroid.x + putRoadBetweenBranches);
                this._structure.houses.left.relativePosition.y = containersBottom + this._structure.houses.left.centroid.y;
            }

            if (this._structure.houses.right.countElements) {
                this._structure.houses.right.relativePosition.x = this._structure.houses.right.centroid.x + putRoadBetweenBranches;
                this._structure.houses.right.relativePosition.y = containersBottom + this._structure.houses.right.centroid.y;
            }
        }
    };

    _addHousesToStructure() {
        // Sort Houses by size (smallest first), to optimize space
        this._houses.sort(function (a, b) {
            return a.dimensions.length - b.dimensions.length;
        });

        this._houses.forEach(function(house, key) {
            if (key%2) {
                this._structure.houses.left.add(house);
            } else {
                this._structure.houses.right.add(house);
            }
        }.bind(this));

        this._structure.houses.left.finalize();
        this._structure.houses.right.finalize();
    };

    _addBranchesToStructure() {
        // Don't sort branches, as we want to keep them consistent over developement
        this._branches.forEach(function(branch, key) {
            if (key%2) {
                branch.rotate(-this._configuration.branchRotation);
                this._structure.branches.left.add(branch);
            } else {
                branch.rotate(this._configuration.branchRotation);
                this._structure.branches.right.add(branch);
            }
        }.bind(this));

        this._structure.branches.left.finalize();
        this._structure.branches.right.finalize();
    };

    _getContainerWidth() {
        var houseWidth = this._getMaxHouseContainerWidth();
        var branchWidth = this._getMaxBranchContainerWidth();
        var containerMargin = (branchWidth && houseWidth) ? this._configurationMargin : 0;

        return houseWidth + branchWidth + this._configuration.initialMargin + containerMargin;
    };

    _getMaxHouseContainerWidth(){
        return Math.max(
            this._structure.houses.left.displayDimensions.width,
            this._structure.houses.right.displayDimensions.width
        );
    }

    _getMaxBranchContainerWidth(){
        return Math.max(
            this._structure.branches.left.displayDimensions.width,
            this._structure.branches.right.displayDimensions.width
        );
    }

    _getContainerLength() {
        var leftLength  = this._getMaxContainerLeftLength();
        var rightLength = this._getMaxContainerRightLength();
        
        return leftLength + this._road.displayDimensions.length + rightLength;
    };

    _getMaxContainerLeftLength() {
        return Math.max(
            this._structure.houses.left.displayDimensions.length,
            this._structure.branches.left.displayDimensions.length
        );
    };

    _getMaxContainerRightLength() {
        return Math.max(
            this._structure.houses.right.displayDimensions.length,
            this._structure.branches.right.displayDimensions.length
        );
    };

    draw(parentPosition, parentRotation) {
        // TODO
        throw 'not yet implemented';
        super.draw(parentPosition, parentRotation);
    };
}

module.exports = StreetContainer;

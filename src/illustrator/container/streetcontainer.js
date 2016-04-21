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
                shape: this._road,
                position: null
            },
            houses: {
                left:  {container: new RowContainer(key + '_hl', RowContainer.ALIGNMENT_RIGHT), position: null},
                right: {container: new RowContainer(key + '_hr', RowContainer.ALIGNMENT_LEFT), position: null}
            },
            branches: {
                left:  {container: new RowContainer(key + '_bl', RowContainer.ALIGNMENT_RIGHT), position: null},
                right: {container: new RowContainer(key + '_br', RowContainer.ALIGNMENT_LEFT), position: null}
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

        this._structure.road.shape.dimensions.width = this.dimensions.length;
        this._structure.road.position = new Point(this.centroid.x, this.centroid.y);

        var containersBottom = -this.centroid.y + this._configuration.initialMargin;

        if (this._branches.length) {
            this._structure.branches.left.position = new Point(
                this.centroid.x - this._structure.branches.left.container.centroid.x - (this._structure.road.shape.width / 2),
                containersBottom + this._structure.branches.left.container.centroid.y
            );
            this._structure.branches.right.position = new Point(
                this.centroid.x + this._structure.branches.right.container.centroid.x + (this._structure.road.shape.width / 2),
                containersBottom + this._structure.branches.right.container.centroid.y
            );

            containersBottom += _getMaxBranchContainerWidth() + this._configuration.containerMargin;
        }

        if (this._houses.length) {
            this._structure.houses.left.position = new Point(
                this.centroid.x - this._structure.houses.left.container.centroid.x - (this._structure.road.shape.width / 2),
                containersBottom + this._structure.houses.left.container.centroid.y
            );
            this._structure.houses.right.position = new Point(
                this.centroid.x + this._structure.houses.right.container.centroid.x + (this._structure.road.shape.width / 2),
                containersBottom + this._structure.houses.right.container.centroid.y
            );
        }
    };

    _addHousesToStructure() {
        // Sort Houses by size (smallest first), to optimize space
        this._houses.sort(function (a, b) {
            return a.dimensions.length - b.dimensions.length;
        });

        this._houses.forEach(function(house, key) {
            if (key%2) {
                this._structure.houses.left.container.add(house);
            } else {
                this._structure.houses.right.container.add(house);
            }
        }.bind(this));

        this._structure.houses.left.container.finalize();
        this._structure.houses.right.container.finalize();
    };

    _addBranchesToStructure() {
        // Don't sort branches, as we want to keep them consistent over developement
        this._branches.forEach(function(branch, key) {
            if (key%2) {
                branch.rotate(-this._configuration.branchRotation);
                this._structure.branches.left.container.add(branch);
            } else {
                branch.rotate(this._configuration.branchRotation);
                this._structure.branches.right.container.add(branch);
            }
        }.bind(this));

        this._structure.branches.left.container.finalize();
        this._structure.branches.right.container.finalize();
    };

    _getContainerWidth() {
        var houseWidth = _getMaxHouseContainerWidth();
        var branchWidth = _getMaxBranchContainerWidth();
        var containerMargin = (branchWidth && houseWidth) ? this._configuration.containerMargin : 0;

        return houseWidth + branchWidth + this._configuration.initialMargin + containerMargin;
    };

    _getMaxHouseContainerWidth(){
        return Math.max(
            this._structure.houses.left.container.displayDimensions.width,
            this._structure.houses.right.container.displayDimensions.width
        );
    }

    _getMaxBranchContainerWidth(){
        return Math.max(
            this._structure.branches.left.container.displayDimensions.width,
            this._structure.branches.right.container.displayDimensions.width
        );
    }

    _getContainerLength() {
        var leftLength = Math.max(
            this._structure.houses.left.container.displayDimensions.length,
            this._structure.branches.left.container.displayDimensions.length
        );
        var rightLength = Math.max(
            this._structure.houses.right.container.displayDimensions.length,
            this._structure.branches.right.container.displayDimensions.length
        );
        
        return leftLength + this._road.displayDimensions.length + rightLength;
    };

    draw() {};
}

module.exports = StreetContainer;

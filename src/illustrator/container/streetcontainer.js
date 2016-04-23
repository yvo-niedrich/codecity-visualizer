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
            initialMargin: 40,
            containerMargin: 40,
            conclusiveMargin: 8,
            elementRotation: 90,
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
        this.dimensions.width  = this._getContainerWidth() + this._configuration.conclusiveMargin;
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

        var containersTop = (this.dimensions.width / 2) - this._configuration.conclusiveMargin;
        var halfTheRoadLength = (this._road.displayDimensions.length / 2);
        var middleOfTheRoad = (this.dimensions.length / 2) - this._getMaxContainerRightLength() - halfTheRoadLength;

        this._structure.road = this._road;
        this._structure.road.dimensions.width = this.dimensions.width;
        this._structure.road.relativePosition.x = middleOfTheRoad;
        this._structure.road.relativePosition.y = 0;

        // containersBottom

        if (this._houses.length) {
            if (this._structure.houses.left.countElements) {
                this._structure.houses.left.relativePosition.x = middleOfTheRoad - halfTheRoadLength - this._structure.houses.left.centroid.x;
                this._structure.houses.left.relativePosition.y = containersTop - this._structure.houses.left.centroid.y;
            }

            if (this._structure.houses.right.countElements) {
                this._structure.houses.right.relativePosition.x = middleOfTheRoad + halfTheRoadLength + this._structure.houses.right.centroid.x;
                this._structure.houses.right.relativePosition.y = containersTop - this._structure.houses.right.centroid.y;
            }

            containersTop -= this._getMaxHouseContainerWidth() + this._configuration.containerMargin;
        }

        if (this._branches.length) {
            if (this._structure.branches.left.countElements) {
                this._structure.branches.left.relativePosition.x = middleOfTheRoad - halfTheRoadLength - this._structure.branches.left.centroid.x;
                this._structure.branches.left.relativePosition.y = containersTop - this._structure.branches.left.centroid.y;
            }

            if (this._structure.branches.right.countElements) {
                this._structure.branches.right.relativePosition.x = middleOfTheRoad + halfTheRoadLength + this._structure.branches.right.centroid.x;
                this._structure.branches.right.relativePosition.y = containersTop - this._structure.branches.right.centroid.y;
            }

        }
    };

    _addHousesToStructure() {
        // Sort Houses by size (biggest first), to optimize space
        this._houses.sort(function (a, b) {
            return b.dimensions.length - a.dimensions.length;
        });

        for (var house of this._houses) {
            var rightRowIsShorter = (this._structure.houses.right.displayDimensions.width < this._structure.houses.left.displayDimensions.width);
            var c = rightRowIsShorter ? this._structure.houses.right : this._structure.houses.left;
            house.rotate(this._configuration.elementRotation * c.alignment);
            c.add(house);
        }

        this._structure.houses.left.finalize();
        this._structure.houses.right.finalize();
    };

    _addBranchesToStructure() {
        // Don't sort branches, as we want to keep them consistent over developement
        this._branches.forEach(function(branch, index) {
            if (index%2) {
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
        var containerMargin = (branchWidth && houseWidth) ? this._configuration.containerMargin : 0;
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

        super.draw(parentPosition, parentRotation);

        var s = [];
        s.push(this._structure.road.draw(this._absolutePosition, this._absoluteRotation));
        
        var hl = this._structure.houses.left.draw(this._absolutePosition, this._absoluteRotation);
        var hr = this._structure.houses.right.draw(this._absolutePosition, this._absoluteRotation);
        
        var bl = this._structure.branches.left.draw(this._absolutePosition, this._absoluteRotation);
        var br = this._structure.branches.right.draw(this._absolutePosition, this._absoluteRotation);

        var t = s.concat(hl, hr, bl, br);

        return t;
    };
}

module.exports = StreetContainer;

var BaseContainer = require("./base.js");
var RowContainer  = require("./row.js");
var ShapeHouse    = require("../shapes/house.js");
var ShapeStreet   = require("../shapes/street.js");
var Point         = require("../components/point.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class StreetContainer extends BaseContainer {
    constructor(key) {
        super(key);

        this._configuration = {
            initialMargin: 25,
            containerMargin: 30,
            conclusiveMargin: 4,
            elementRotation: 90,
            branchRotation: 90
        };

        this._shapes = {
            'road': null,
            'houses': [],
            'branches': []
        }

        this._container = {
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
            this._shapes.branches.push(shape);
        } else if (shape instanceof ShapeHouse) {
            this._shapes.houses.push(shape);
        } else if (shape instanceof ShapeStreet) {
            if (this._shapes.road !== null) {
                throw 'StreetContainer can only have one road.'
            }
            this._shapes.road = shape;
        } else {
            throw 'Unknown Shape';
        }
    };

    _finalize() {
        super._finalize();

        if (this._shapes.road === null) {
            throw 'StreetContainer requires a primary street'
        }
        var mainRoad = this._shapes.road;

        this._addHousesToStructure();
        this._addBranchesToStructure();
        this._updateDimensions();

        var containersTop = (this.dimensions.width / 2) - this._configuration.conclusiveMargin;
        var halfTheRoadLength = (mainRoad.displayDimensions.length / 2);
        var middleOfTheRoad = (this.dimensions.length / 2) - this._getMaxContainerRightLength() - halfTheRoadLength;

        mainRoad.dimensions.width = this.dimensions.width;
        mainRoad.relativePosition.x = middleOfTheRoad;
        mainRoad.relativePosition.y = 0;

        if (this._shapes.houses.length) {
            if (this._container.houses.left.size) {
                this._container.houses.left.relativePosition.x = middleOfTheRoad - halfTheRoadLength - this._container.houses.left.centroid.x;
                this._container.houses.left.relativePosition.y = containersTop - this._container.houses.left.centroid.y;
            }

            if (this._container.houses.right.size) {
                this._container.houses.right.relativePosition.x = middleOfTheRoad + halfTheRoadLength + this._container.houses.right.centroid.x;
                this._container.houses.right.relativePosition.y = containersTop - this._container.houses.right.centroid.y;
            }

            containersTop -= this._getMaxHouseContainerWidth() + this._configuration.containerMargin;
        }

        if (this._shapes.branches.length) {
            if (this._container.branches.left.size) {
                this._container.branches.left.relativePosition.x = middleOfTheRoad - halfTheRoadLength - this._container.branches.left.centroid.x;
                this._container.branches.left.relativePosition.y = containersTop - this._container.branches.left.centroid.y;
            }

            if (this._container.branches.right.size) {
                this._container.branches.right.relativePosition.x = middleOfTheRoad + halfTheRoadLength + this._container.branches.right.centroid.x;
                this._container.branches.right.relativePosition.y = containersTop - this._container.branches.right.centroid.y;
            }

        }

        super.add(this._shapes.road)
        super.add(this._container.houses.left)
        super.add(this._container.houses.right)
        super.add(this._container.branches.left)
        super.add(this._container.branches.right)
    };

    _addHousesToStructure() {
        var houses = this._shapes.houses;
        // Sort Houses by size (biggest first), to optimize space
        houses.sort(function (a, b) {
            return b.dimensions.length - a.dimensions.length;
        });

        var diff = 0;
        for (var house of houses) {
            var c = (diff > 0) ? this._container.houses.right : this._container.houses.left;
            house.rotate(this._configuration.elementRotation * c.alignment);
            c.add(house);
            diff += house.displayDimensions.width * c.alignment;
        }
    };

    _addBranchesToStructure() {
        // Don't sort branches, as we want to keep them consistent over developement cycles
        var branches = this._shapes.branches;
        branches.forEach(function(branch, index) {
            if (index%2) {
                branch.rotate(-this._configuration.branchRotation);
                this._container.branches.left.add(branch);
            } else {
                branch.rotate(this._configuration.branchRotation);
                this._container.branches.right.add(branch);
            }
        }.bind(this));
    };

    _getContainerWidth() {
        var houseWidth = this._getMaxHouseContainerWidth();
        var branchWidth = this._getMaxBranchContainerWidth();
        var containerMargin = (branchWidth && houseWidth) ? this._configuration.containerMargin : 0;
        return houseWidth + branchWidth + this._configuration.initialMargin + containerMargin;
    };

    _getMaxHouseContainerWidth(){
        return Math.max(
            this._container.houses.left.displayDimensions.width,
            this._container.houses.right.displayDimensions.width
        );
    }

    _getMaxBranchContainerWidth(){
        return Math.max(
            this._container.branches.left.displayDimensions.width,
            this._container.branches.right.displayDimensions.width
        );
    }

    _getContainerLength() {
        var leftLength  = this._getMaxContainerLeftLength();
        var rightLength = this._getMaxContainerRightLength();
        
        return leftLength + this._shapes.road.displayDimensions.length + rightLength;
    };

    _getMaxContainerLeftLength() {
        return Math.max(
            this._container.houses.left.displayDimensions.length,
            this._container.branches.left.displayDimensions.length
        );
    };

    _getMaxContainerRightLength() {
        return Math.max(
            this._container.houses.right.displayDimensions.length,
            this._container.branches.right.displayDimensions.length
        );
    };
}

module.exports = StreetContainer;

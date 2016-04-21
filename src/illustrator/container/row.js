var BaseContainer = require("./base.js");
var Point         = require("../geometry/point.js");

/**
 * Rows Elements one after the other
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class RowContainer extends BaseContainer {
    static get ALIGNMENT_LEFT() { return -1; }
    static get ALIGNMENT_RIGHT() { return 1; }

    constructor(key, alignment) {
        super(key);
        this._shapeList = [];
        this._alignment = alignment;
    };

    _updateDimensions(newShapeDimensions) {
        this.dimensions.length = Math.max(newShapeDimensions.length, this.dimensions.length);
        this.dimensions.width += newShapeDimensions.width;
    }

    add(shape) {
        shape.rotate = 90 * this._alignment;
        this._shapeList.push({
            shape: shape,
            position: null
        });
        this._updateDimensions(shape.displayDimensions)

    };

    finalize() {
        if (!this._shapeList.length) {
            return;
        }

        var barrierXAxis = this.centroid.x * this._alignment;
        var firstFreePosition = -this.centroid.y;

        this._shapeList.forEach(function(element) {
            element.position = new Point(
                barrierXAxis - (element.shape.centroid.x * this._alignment),
                firstFreePosition + element.shape.centroid.y
            );

            firstFreePosition += element.shape.displayDimensions.width;
        }.bind(this));
    };

    draw() {};
}

module.exports = RowContainer;

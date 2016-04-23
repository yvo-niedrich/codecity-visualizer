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

    get alignment() {
        return this._alignment;
    }

    finalize() {
        if (!this.count) {
            return;
        }

        for (var shape of this.shapes) {
            this._updateDimensions(shape.displayDimensions);
        }
        
        var barrierXAxis = (this.dimensions.length / 2) * this._alignment;
        var firstFreePosition = this.dimensions.width / 2;

        for (var shape of this.shapes) {
            shape.relativePosition.x = barrierXAxis - (shape.centroid.x * this._alignment);
            shape.relativePosition.y = firstFreePosition - shape.centroid.y;
            firstFreePosition -= shape.displayDimensions.width;
        }
    };
}

module.exports = RowContainer;

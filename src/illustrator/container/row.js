var MirrorContainer = require("./base-mirror.js");
var Point           = require("../components/point.js");

/**
 * Rows Elements one after the other
 * 
 * @implements MirrorContainer
 * @implements BaseContainer
 * @implements BaseShape
 */
class RowContainer extends MirrorContainer {

    constructor(key, mirror = false) {
        super(key, mirror);
    };

    _finalize() {
        super._finalize();
        
        if (!this.size) {
            return;
        }

        this._calcualteFinalDimensions();
        this._positionShapes();
    };

    _calcualteFinalDimensions() {
        for (var shape of this.shapes) {
            this.dimensions.length += shape.displayDimensions.length;
            this.dimensions.width   = Math.max(shape.displayDimensions.width, this.dimensions.width);
            this.dimensions.height  = Math.max(shape.displayDimensions.height, this.dimensions.height);
        }
    };

    _positionShapes() {
        var firstFreePosition = -(this.dimensions.length / 2);

        for (var shape of this.shapes) {
            shape.position.x = firstFreePosition + (shape.displayDimensions.length / 2);
            shape.position.y = this._alignOnXAxis(shape.displayDimensions.width);

            firstFreePosition += shape.displayDimensions.length;
        }
    };

    _alignOnXAxis(shapeWidth) {
        var p = this.isMirrored ? (this.dimensions.width - shapeWidth) : (shapeWidth - this.dimensions.width);
        return p / 2;
    };
}

module.exports = RowContainer;

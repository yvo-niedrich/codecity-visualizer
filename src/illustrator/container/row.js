var BaseContainer = require("./base.js");
var Point         = require("../components/point.js");

/**
 * Rows Elements one after the other
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class RowContainer extends BaseContainer {

    constructor(key) {
        super(key);
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
        var middleAlignment = -(this.dimensions.width / 2);

        for (var shape of this.shapes) {
            shape.position.x = firstFreePosition + (shape.displayDimensions.length / 2);
            shape.position.y = middleAlignment + shape.displayDimensions.width / 2;
            // shape.position.z = shape.displayDimensions.height / 2; // TODO !!!

            firstFreePosition += shape.displayDimensions.length;
        }
    };
}

module.exports = RowContainer;

var MirrorContainer = require("./base-mirror.js");
var Strip           = require("./helper/strip.js");
var Cuboid          = require("../components/cuboid.js");

/**
 * Rows Elements one after the other
 *
 * @todo seperator-attribut!
 * 
 * @implements MirrorContainer
 * @implements BaseContainer
 * @implements BaseShape
 */
class GridContainer extends MirrorContainer {

    constructor(key, mirror = false) {
        super(key, mirror);
        this._shapes = [];
        this._strips = [];
        this._activeStrip = -1;
    };

    add(shape) {
        this._shapes.push(shape);
    }

    _finalize() {
        super._finalize();
        
        if (!this._shapes.length) {
            return;
        }

        this._createNewStrip();
        this._activeStrip = 0;

        this._calculateGrid();
        this._calcualteFinalDimensions();
        this._positionStrips();

        for (var s of this._strips) {
            super.add(s.container);
        }
    };


    _calculateGrid() {
        var backupCounter = 0;
        while (this._shapes.length) {
            var strip = this._strips[this._activeStrip];
            var shape = this._shapes.shift();

            // 1. If a new Strip was just created, add the shape
            //    And then return the pointer to the first strip
            if (!strip.dimensions.length) {
                strip.add(shape);
                this._activeStrip = 0;

                continue;
            }

            // 2. Will the new shape impare the aspect ratio?
            var currentDimensions = this._getCurrentDimensions();
            var newLength = strip.dimensions.length + shape.displayDimensions.length;
            if (newLength / currentDimensions.width > 1) {
                // => Insert would impare aspect ratio
                
                // If this is the last strip, create a new strip
                if (this._activeStrip + 1 === this._strips.length) {
                    this._createNewStrip();
                }

                // try inserting at the next strip
                this._shapes.unshift(shape);
                this._activeStrip++;
                continue;
            }

            // 3. The Shape will not impair the aspect ratio on 
            //    the current strip. Insert the shape.
            var updateOffsets = strip.add(shape);

            if(updateOffsets) {
                this._recalculateStripOffsets();
            }
        }
    };

    _createNewStrip() {
        var rowName = this.key + '_r' + this._strips.length;
        this._strips.push(new Strip(rowName, this.isMirrored));
        this._recalculateStripOffsets();
    };

    _recalculateStripOffsets() {
        var offset = 0;
        for (var i = 0; i < this._strips.length; i++) {
            this._strips[i].offset = offset;
            offset += this._strips[i].dimensions.width;
        }
    }

    _getCurrentDimensions() {
        var d = new Cuboid();

        for (var s of this._strips) {
            d.length = Math.max(d.length, s.dimensions.length);
            d.width += s.dimensions.width;
            d.height = Math.max(d.height, s.dimensions.height);
        }

        return d;
    }
    
    _calcualteFinalDimensions() {
        var d = this._getCurrentDimensions();
        this.dimensions.length = d.length;
        this.dimensions.width  = d.width;
        this.dimensions.height = d.height;
    };

    _positionStrips() {
        for (var strip of this._strips) {
            strip.container.position.x = (strip.dimensions.length - this.dimensions.length) / 2
            strip.container.position.y = this._calcuateYAxisPosition(strip.offset, strip.dimensions.width);
        }
    };

    _calcuateYAxisPosition(offset, width) {
        var rowPosOffset = offset + (width / 2);
        var origin = this.dimensions.width / 2;

        return this.isMirrored ? (origin - rowPosOffset) : (rowPosOffset - origin);
    };
};

module.exports = GridContainer;

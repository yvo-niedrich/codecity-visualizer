var MirrorContainer = require("./base-mirror.js");
var Row             = require("./row.js");
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
            super.add(s.row);
        }
    };


    _calculateGrid() {
        var backupCounter = 0;
        while (this._shapes.length) {
            if (++backupCounter === 100) throw 'LOOP EXCEPTION!';

            var c = this._strips[this._activeStrip];
            var s = this._shapes.shift();

            // 1. If a new Strip was just created, add the shape
            //    And then return the pointer to the first strip
            if (!c.length) {
                this._addShapeToStrip(s, c);
                this._activeStrip = 0;

                continue;
            }

            // 2. Will the new shape impare the aspect ratio?
            var currentDimensions = this._getCurrentDimensions();
            var newLength = c.length + s.displayDimensions.length;
            if (newLength / currentDimensions.width > 1) {
                // => Insert would impare aspect ratio
                
                // If this is the last strip, create a new strip
                if (this._activeStrip + 1 === this._strips.length) {
                    this._createNewStrip();
                }

                // try inserting at the next strip
                this._shapes.unshift(s);
                this._activeStrip++;
                continue;
            }

            // 3. The Shape will not impair the aspect ratio on 
            //    the current strip. Insert the shape.
            this._addShapeToStrip(s, c);
        }
    };

    _createNewStrip() {
        var rowName = this.key + '_r' + this._strips.length;
        var s = {
            start: 0,
            width: 0,
            length: 0,
            height: 0,
            row: new Row(rowName, this.isMirrored)
        };

        for (var strip of this._strips) {
            s.start += strip.width;
        }

        this._strips.push(s);
    };

    _addShapeToStrip(shape, strip) {
        var widthChanged = (strip.width < shape.displayDimensions.width);

        strip.length += shape.displayDimensions.length;
        strip.width  = Math.max(strip.width, shape.displayDimensions.width);
        strip.height = Math.max(strip.height, shape.displayDimensions.height);
        strip.row.add(shape);

        if (!widthChanged) {
            return;
        }

        var start = 0;
        for (var i = 0; i < this._strips.length; i++) {
            this._strips[i].start = start;
            start += this._strips[i].width;
        }
    };

    _getCurrentDimensions() {
        var d = new Cuboid();

        for (var s of this._strips) {
            d.length = Math.max(d.length, s.length);
            d.width += s.width;
            d.height = Math.max(d.height, s.height);
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
            strip.row.position.x = (strip.length - this.dimensions.length) / 2
            strip.row.position.y = this._calcuateYAxisPosition(strip.start, strip.width);
        }
    };

    _calcuateYAxisPosition(offset, width) {
        var alignment = this.isMirrored ? 1 : -1;
        var origin = this.dimensions.width / 2 * alignment;
        var start = origin - (offset * alignment);
        return start - (width / 2 * alignment)
    };
}

module.exports = GridContainer;

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Row = require("../row.js");
var Cuboid = require("../../components/cuboid.js");

/**
 * Strip is a helperclass for the GRID-Algorithm. 
 * It's contents shall not be shared. with other classes.
 */

var Strip = function () {
    function Strip(name, mirrored) {
        _classCallCheck(this, Strip);

        this._offset = 0;
        this._dimensions = new Cuboid();
        this._container = new Row(name, mirrored);

        if (mirrored) {
            this._container.rotate(180);
        }
    }

    _createClass(Strip, [{
        key: "add",
        value: function add(shape) {
            var recommendOffsetRecalculation = this.dimensions.length && this.dimensions.width < shape.displayDimensions.width;

            this.dimensions.length += shape.displayDimensions.length;
            this.dimensions.width = Math.max(this.dimensions.width, shape.displayDimensions.width);
            this.dimensions.height = Math.max(this.dimensions.height, shape.displayDimensions.height);

            this._container.add(shape);

            return recommendOffsetRecalculation;
        }
    }, {
        key: "container",
        get: function get() {
            return this._container;
        }
    }, {
        key: "dimensions",
        get: function get() {
            return this._dimensions;
        }
    }, {
        key: "offset",
        get: function get() {
            return this._offset;
        },
        set: function set(val) {
            this._offset = val;
        }
    }]);

    return Strip;
}();

;

module.exports = Strip;
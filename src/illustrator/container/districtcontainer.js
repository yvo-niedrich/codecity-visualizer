var BaseContainer     = require("./base.js");
var LightmapContainer = require("./lightmap.js");
var ShapeHouse        = require("../shapes/house.js");
var ShapePlattform    = require("../shapes/plattform.js");
var Point             = require("../components/point.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class DistrictContainer extends BaseContainer {
    constructor(key, options = {}) {
        super(key);
        this._options = {
            'spacer.margin': 10,
            'spacer.padding': 5,

            'container': LightmapContainer,
            'container.options': false,

            'houses': LightmapContainer,
            'houses.options': {}
        };

        for (var i in options) {
            this._options[i] = options[i];
        }

        this._houses = new this._options['houses'](this.key + '_d', this._options['houses.options']);
        this._container = new this._options['container'](this.key + '_d', this._options['container.options']);
        super.add(this._container);
    };

    _updateDimensions() {
        this.dimensions.length = this._getContainerLength();
        this.dimensions.width  = this._getContainerWidth() + this._options['spacer.conclusive'];
    };

    add(shape) {
        if (shape instanceof BaseContainer) {
            this._container.add(shape);
        } else if (shape instanceof ShapeHouse) {
            this._houses.add(shape);
        } else {
            throw 'Unbekannter Shape-Typ'
        }
        
    };

    _finalize() {
        super._finalize();

        this._container.add(this._houses);

        var padding = 2 * this._options['spacer.padding'];
        this.dimensions.length = this._container.displayDimensions.length + padding;
        this.dimensions.width  = this._container.displayDimensions.width + padding;
        this.dimensions.height  = this._container.displayDimensions.height;

        var plattform = new ShapePlattform(this.key + '_p');
        plattform.dimensions.length = this.dimensions.length;
        plattform.dimensions.width = this.dimensions.width;
        plattform.dimensions.height = 10;
        plattform.position.z = -10;

        var margin = 2 * this._options['spacer.margin'];
        this.dimensions.length += margin;
        this.dimensions.width  += margin;

        super.add(plattform);
    };
}

module.exports = DistrictContainer;

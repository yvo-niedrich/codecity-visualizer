var BaseContainer     = require("./../base.js");
var SpecificContainer = require("./../base-specific.js");
var LightmapContainer = require("./../universal/lightmap.js");
var ShapeHouse        = require("../../shapes/house.js");
var ShapePlatform     = require("../../shapes/platform.js");

/**
 * Create an District Layout City Container
 */
class DistrictContainer extends SpecificContainer {
    constructor(key, options = {}) {
        super(key, options);

        this.setOptions(options);
        this.setDefaults({
            'spacer.margin': 10,
            'spacer.padding': 5,

            'district.container': LightmapContainer,
            'district.options': false,

            'houses.container': LightmapContainer,
            'houses.options': false
        });

        this._container = {
            'houses': new (this.getOption('houses.container'))(this.key + '_d', this.getOption('houses.options')),
            'districts': new (this.getOption('district.container'))(this.key + '_d', this.getOption('district.options')),
            'platform': null
        };
        super.add(this._container.districts);
    }

    add(shape) {
        if (shape instanceof BaseContainer) {
            this._container.districts.add(shape);
        } else if (shape instanceof ShapeHouse) {
            this._container.houses.add(shape);
        } else if (shape instanceof ShapePlatform) {
            if (this._container.platform !== null) {
                throw 'DistrictContainer can only have one platform.';
            }

            this._container.platform = shape;
        } else {
            throw 'Unbekannter Shape-Typ';
        }
    }

    finalize() {
        super.finalize();

        this._container.districts.add(this._container.houses);

        var padding = 2 * this.getOption('spacer.padding');
        this.dimensions.length = this._container.districts.displayDimensions.length + padding;
        this.dimensions.width  = this._container.districts.displayDimensions.width + padding;
        this.dimensions.height  = this._container.districts.displayDimensions.height;

        this._createPlatform();

        var margin = 2 * this.getOption('spacer.margin');
        this.dimensions.length = margin + this.dimensions.length;
        this.dimensions.width  = margin + this.dimensions.width;
    }

    _createPlatform() {
        if (!this._container.platform) {
            this._container.platform = new ShapePlatform(this.key + '_p');
        }

        this._container.platform.dimensions.length = this.dimensions.length;
        this._container.platform.dimensions.width = this.dimensions.width;

        // Lift everything else above the platform
        var platformHeight = this._container.platform.dimensions.height;
        this._container.platform.position.z = -platformHeight;
        this.position.z = platformHeight + this.position.z;

        super.add(this._container.platform);
    }
}

module.exports = DistrictContainer;

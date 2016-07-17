var BaseIllustrator = require("./base.js");
var Point           = require("../components/Point").Point;
var Illustration    = require('./components/illustration.js');
var ShapeHouse      = require('./components/Shapes').House;
var ShapePlatform   = require('./components/Shapes').Platform;
var ShapeContainer  = require("./container/specific/districtcontainer.js");

/**
 * Create an District Layout City
 */
class District extends BaseIllustrator {
    constructor(model, options = {}) {
        super(model, options);

        this._model = model;
        this.setOptions(options);
        this.setDefaults({
            'layout.tower': true,

            'house.length': 12,
            'house.width': 12,
            'house.height': 12,
            'house.margin': 3,
            'house.color': 0x1A212E,

            'platform.height': 10,
            'platform.color': 0x000000,

            'district.container': ShapeContainer,
            'district.options': {}
        });
    }

    draw(version) {
        var spatialModel = this._createSpatialModel(this._model.tree, version);

        var origin = new Point(0, 0, 0);
        var rotation = 0;
        spatialModel.draw(origin, rotation);

        var illustration = new Illustration(version);
        for (var shape of spatialModel.getSpatialInformation()) {
            illustration.addShape(shape);
        }
        
        return illustration;
    }

    _createSpatialModel(tree, version) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }

        if (this._preventTower(tree)) {
            return this._createSpatialModel(tree.children[0], version)
        }

        const container = this._createContainer(tree);
        container.add(this._createPlatform(tree, version));

        for (const child of tree.children) {
            if (this._model.exists(child, version)) {
                container.add(this._createSpatialModel(child, version));
            }
        }

        return container;
    }

    _preventTower(node) {
        return !this.getOption('layout.tower') &&
            node.children.length === 1 &&
            node.children[0].children.length;
    }

    _createContainer(name) {
        var cClass = this.getOption('district.container');
        return new cClass(name + '_c', this.getOption('district.options'));
    }

    _createHouse(node, version) {
        var defaultLayout = {
            'dimensions.length': this.getOption('house.length'),
            'dimensions.width': this.getOption('house.width'),
            'dimensions.height': this.getOption('house.height'),
            'margin': this.getOption('house.margin'),
            'color': this.getOption('house.color')
        };

        var house = new ShapeHouse(node);
        house.updateAttributes(Object.assign(defaultLayout, this.applyRules(node, this._model, version)));

        return house;
    }

    _createPlatform(node, version) {
        var defaultLayout = {
            'color': this.getOption('platform.color'),
            'dimensions.height': this.getOption('platform.height')
        };

        var platform = new ShapePlatform(node);
        platform.updateAttributes(Object.assign(defaultLayout, this.applyRules(node, this._model, version)));

        return platform;
    }
}

module.exports = District;

var BaseIllustrator = require("./base.js");
var Point           = require("./components/point.js");
var Illustration    = require('./components/illustration.js');
var ShapeHouse      = require("./shapes/house.js");
var ShapePlatform   = require("./shapes/platform.js");
var ShapeContainer  = require("./container/specific/districtcontainer.js");

/**
 * Create an District Layout City
 */
class District extends BaseIllustrator {
    constructor(model, options = {}) {
        super(model, options);

        this._rules = [];
        this._model = model;
        this.setOptions(options);
        this.setDefaults({
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

    addRule(rule) {
        this._rules.push(rule);
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

    _createSpatialModel(tree, version, depth = 0) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }


        var cClass = this.getOption('district.container');
        var container = new cClass(tree, this.getOption('district.options'));
        container.add(this._createPlatform(tree, version));

        for (var child of tree.children) {
            container.add(this._createSpatialModel(child, version, depth + 1));
        }

        return container;
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
        house.updateAttributes(defaultLayout);
        this._applyRules(node, version, house);
        return house;
    }

    _createPlatform(node, version) {
        var defaultLayout = {
            'color': this.getOption('platform.color'),
            'dimensions.height': this.getOption('platform.height')
        };

        var platform = new ShapePlatform(this.key + '_p');
        platform.updateAttributes(defaultLayout);
        this._applyRules(node, version, platform);
        return platform;
    }

    _applyRules(node, version, shape) {
        var attributes = {};
        for (var rule of this._rules) {
            Object.assign(attributes, rule(node, version, this._model));
        }

        shape.updateAttributes(attributes);
    }
}

module.exports = District;

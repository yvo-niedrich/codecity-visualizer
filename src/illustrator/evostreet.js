var BaseIllustrator = require("./base.js");
var Point           = require("./components/point.js");
var Illustration    = require('./components/illustration.js');
var ShapeHouse      = require("./shapes/house.js");
var ShapeStreet     = require("./shapes/street.js");
var ShapeContainer  = require("./container/specific/streetcontainer.js");
// var ConfigurableInterface = require('./interfaces/configurable.js');

/**
 * Create an Evostreet Layout city
 */
class Evostreet extends BaseIllustrator {
    constructor(model, options = {}) {
        super();

        this._rules = [];
        this._model = model;
        this.setOptions(options);
        this.setDefaults({
            'highway.length': 40,
            'highway.color': 0x156289,

            'street.length': 20,
            'street.color': 0x156289,

            'house.length': 12,
            'house.width': 12,
            'house.height': 12,
            'house.margin': 3,
            'house.color': 0x1A212E,

            'evostreet.container': ShapeContainer,
            'evostreet.options': {}
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

    _createSpatialModel(tree, version) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }

        var cClass = this.getOption('evostreet.container');
        var container = new cClass(tree, this.getOption('evostreet.options'));

        for (var child of tree.children) {
            container.add(this._createSpatialModel(child, version));
        }

        if (tree.parent === null) {
            container.add(this._createHighway(tree, version));
        } else {
            container.add(this._createStreet(tree, version));
        }

        return container;
    }

    _createHighway(node, version) {
        var defaultLayout = {
            'dimensions.length': this.getOption('highway.length'),
            'dimensions.height': 1,
            'color': this.getOption('highway.color')
        };

        var highway = new ShapeStreet(node);
        highway.updateAttributes(defaultLayout);
        this._applyRules(node, version, highway);
        return highway;
    }

    _createStreet(node, version) {
        var defaultLayout = {
            'dimensions.length': this.getOption('street.length'),
            'dimensions.height': 1,
            'color': this.getOption('street.color')
        };

        var street = new ShapeStreet(node);
        street.updateAttributes(defaultLayout);
        this._applyRules(node, version, street);
        return street;
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

    _applyRules(node, version, shape) {
        var attributes = {};
        for (var rule of this._rules) {
            Object.assign(attributes, rule(node, version, this._model));
        }

        shape.updateAttributes(attributes);
    }
}

module.exports = Evostreet;

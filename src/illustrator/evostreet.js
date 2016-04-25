var BaseIllustrator = require("./base.js");
var Point           = require("./components/point.js");
var Illustration    = require('./components/illustration.js');
var ShapeHouse      = require("./shapes/house.js");
var ShapeStreet     = require("./shapes/street.js");
var ShapeContainer  = require("./container/streetcontainer.js");

/**
 * Create an evostreet city
 *
 * @implements BaseIllustrator
 */
class Evostreet extends BaseIllustrator {
    constructor(model, options) {
        super(model, options);

        this._model = model;
        this._options = options;
        this._rules = [];

        var defaults = {
            highwayLength: function() { return 36; },
            streetLength: function() { return 18; },
            houseLength: function() { return 16; },
            houseMargin: function() { return 4; }
        }

        for (var key in defaults) {
            if (key in this._options) {
                continue;
            }

            this._options[key] = defaults[key];
        }
    };

    addRule(rule) {
        this._rules.push(rule);
    };

    draw(version) {
        var spatialModel = this._createSpatialModel(this._model.tree, version);

        var origin = new Point(0, 0);
        var rotation = 0;
        spatialModel.draw(origin, rotation);

        var illustration = new Illustration(version);
        for (var shape of spatialModel.getSpatialInformation()) {
            illustration.addShape(shape);
        }
        
        return illustration;
    }

    _getOption(reference, tree, version) {
        return this._options[reference](tree, version, this._model);
    }

    _createSpatialModel(tree, version) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }

        var container = new ShapeContainer(tree + 'container');
        for (var child of tree.children) {
            container.add(this._createSpatialModel(child, version));
        }

        if (tree.parent === null) {
            container.add(this._createHighway(tree, version));
        } else {
            container.add(this._createStreet(tree, version));
        }

        return container;
    };

    _createHighway(node, version) {
        var highway = new ShapeStreet(node);
        highway.dimensions.length = this._getOption('highwayLength', node, version);
        this._applyRules(node, version, highway);
        return highway;
    };

    _createStreet(node, version) {
        var street = new ShapeStreet(node);
        street.dimensions.length = this._getOption('streetLength', node, version);
        this._applyRules(node, version, street);
        return street;
    };

    _createHouse(node, version) {
        var house = new ShapeHouse(node);
        house.margin = this._getOption('houseMargin', node, version);
        this._applyRules(node, version, house);

        //TODO: Rules!
        var size = this._getOption('houseLength', node, version);
        house.dimensions.length = size;
        house.dimensions.width  = size;

        return house;
    };

    _applyRules(node, version, shape) {
        var attributes = {};
        for (var rule of this._rules) {
            Object.assign(attributes, rule(node, version, this._model))
        }

        shape.updateAttributes(attributes);
    }
}

module.exports = Evostreet;

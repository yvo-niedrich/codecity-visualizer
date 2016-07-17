var BaseIllustrator = require("./Illustrator").Illustrator;
var Point           = require("../components/Point").Point;
var Illustration    = require('./components/illustration.js');
var ShapeHouse      = require("./components/Shapes").House;
var ShapeStreet     = require("./components/Shapes").Street;
var ShapeContainer  = require("./container/specific/streetcontainer.js");

/**
 * Create an Evostreet Layout city
 */
class Evostreet extends BaseIllustrator {
    constructor(model, options = {}) {
        super();

        this._model = model;
        this.setOptions(options);
        this.setDefaults({
            'layout.snail': true,

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

    _createSpatialModel(tree, version, skippedRoot = false) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }

        if (this._preventSnail(tree)) {
            return this._createSpatialModel(tree.children[0], version, skippedRoot || tree.parent === null);
        }

        const container = this._createContainer(tree);
        container.add(this._createRoad(tree, version, skippedRoot));

        for (var child of tree.children) {
            container.add(this._createSpatialModel(child, version));
        }

        return container;
    }

    _preventSnail(node) {
        return !this.getOption('layout.snail') &&
            node.children.length === 1 &&
            node.children[0].children.length;
    }
    
    _createContainer(name) {
        var cClass = this.getOption('evostreet.container');
        return new cClass(name + '_c', this.getOption('evostreet.options'));
    }

    _createRoad(node, version, forceRoot = false) {
        if (node.parent === null || forceRoot) {
            return this._createHighway(node, version);
        } else {
            return this._createStreet(node, version);
        }
    }

    _createHighway(node, version) {
        var defaultLayout = {
            'dimensions.length': this.getOption('highway.length'),
            'dimensions.height': 1,
            'color': this.getOption('highway.color')
        };

        var highway = new ShapeStreet(node);
        highway.updateAttributes(Object.assign(defaultLayout, this.applyRules(node, this._model, version)));
        return highway;
    }

    _createStreet(node, version) {
        var defaultLayout = {
            'dimensions.length': this.getOption('street.length'),
            'dimensions.height': 1,
            'color': this.getOption('street.color')
        };

        var street = new ShapeStreet(node);
        street.updateAttributes(Object.assign(defaultLayout, this.applyRules(node, this._model, version)));
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
        house.updateAttributes(Object.assign(defaultLayout, this.applyRules(node, this._model, version)));
        return house;
    }
}

module.exports = Evostreet;

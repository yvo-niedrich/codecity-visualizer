var BaseIllustrator = require("./base.js");
var Point           = require("./geometry/point.js");
var ShapeHouse      = require("./shapes/house.js");
var ShapeStreet     = require("./shapes/street.js");
var ShapeHighway    = require("./shapes/highway.js");
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

        var defaults = {
            highwayLength: function() { return 44; },
            streetLength: function() { return 20; },
            houseLength: function() { return 12 + Math.floor(Math.random() * 16) * 4; },
            houseMargin: function() { return 4; }
        }

        for (var key in defaults) {
            if (key in this._options) continue;
            this._options[key] = defaults[key];
        }
    };

    _createSpatialModel(tree, version) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }
        this._tmp = 0;

        var container = new ShapeContainer(tree + 'container');
        for (var child of tree.children) {
            container.add(this._createSpatialModel(child, version));
        }

        if (tree.parent === null) {
            container.add(this._createHighway(tree, version));
        } else {
            container.add(this._createStreet(tree, version));
        }

        container.finalize();
        return container;
    };

    _createHighway(node, version) {
        var highway = new ShapeHighway(node);
        highway.dimensions.length = this._options.highwayLength(node, version);
        return highway;
    };

    _createStreet(node, version) {
        var street = new ShapeStreet(node);
        street.dimensions.length = this._options.streetLength(node, version);
        return street;
    };

    _createHouse(node, version) {
        var house = new ShapeHouse(node);
        house.margin = this._options.houseMargin(node, version);
        house.size   = this._options.houseLength(node, version);
        return house;
    };

    draw(version) {
        var spatialModel = this._createSpatialModel(this._model.tree, version);
        var origin = new Point(0, 0);
        var rotation = 0;
        
        return spatialModel.draw(origin, rotation);
    }
}

module.exports = Evostreet;

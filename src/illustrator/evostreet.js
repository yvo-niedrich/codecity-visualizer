var BaseIllustrator = require("./base.js");
var Point           = require("./geometry/point.js");
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
        highway.dimensions.length = this._getOption('highwayLength', node, version)
        return highway;
    };

    _createStreet(node, version) {
        var street = new ShapeStreet(node);
        street.dimensions.length = this._getOption('streetLength', node, version);
        return street;
    };

    _createHouse(node, version) {
        var house = new ShapeHouse(node);
        var size = this._getOption('houseLength', node, version);
        house.margin = this._getOption('houseMargin', node, version);
        house.dimensions.length = size;
        house.dimensions.width  = size;
        return house;
    };

    draw(version) {
        var spatialModel = this._createSpatialModel(this._model.tree, version);

        var origin = new Point(0, 0);
        var rotation = 0;
        spatialModel.draw(origin, rotation);
        
        return spatialModel.getSpatialInformation();;
    }
}

module.exports = Evostreet;

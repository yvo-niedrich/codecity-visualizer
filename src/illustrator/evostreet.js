var BaseIllustrator = require("./base.js");
var ShapeHouse      = require("./shapes/house.js");
var ShapeStreet     = require("./shapes/street.js");
var ShapeHighway    = require("./shapes/highway.js");
var ShapeContainer  = require("./container/streetcontainer.js");

/**
 * Create an evostreet city
 * @TODO
 * 
 * @implements BaseIllustrator
 */
class Evostreet extends BaseIllustrator {
    constructor(model, options) {
        super(model, options);

        this._model = model;
        this._options = options;

        // @TODO: Apply options

        this._spatial = this._createSpatialModel(this._model.tree);
    }

    _createSpatialModel(tree) {
        if (!tree.children.length) {
            // @TODO: configure shape
            return this._createHouse(tree);
        }

        var container = new ShapeContainer(tree);
        for (var child of tree.children) {
            container.add(this._createSpatialModel(child));
        }

        if (tree.parent === null) {
            var self = new ShapeHighway(tree);
            // @TODO: configure shape
            container.add(self);
        } else {
            var self = new ShapeStreet(tree);
            // @TODO: configure shape
            container.add(self);
        }

        container.finalize();
        return container;
    }

    _createHouse(node) {
        var house = new ShapeHouse(node);
        // Apply Spatial properties
        return house;
    }
}

module.exports = Evostreet;

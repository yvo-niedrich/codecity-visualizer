var BaseIllustrator = require("./base.js");
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

        // @TODO: Apply options

        this._spatial = this._createSpatialModel(this._model.tree);
    };

    _createSpatialModel(tree) {
        if (!tree.children.length) {
            return this._createHouse(tree);
        }

        var container = new ShapeContainer(tree);
        for (var child of tree.children) {
            container.add(this._createSpatialModel(child));
        }

        if (tree.parent === null) {
            var highway = new ShapeHighway(tree);
            container.add(highway);
        } else {
            var street = new ShapeStreet(tree);
            container.add(street);
        }

        container.finalize();
        return container;
    };

    _createHouse(node) {
        var house = new ShapeHouse(node);
        return house;
    };
}

module.exports = Evostreet;

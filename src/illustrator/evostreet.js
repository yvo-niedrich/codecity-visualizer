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

        // TODO: Apply options

        this._spatial = this._createSpatialModel(this._model.tree);
    };

    _createSpatialModel(tree) {
        if (!tree.children.length) {
            return this._createHouse(tree);
        }

        var container = new ShapeContainer(tree + 'container');
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

    draw() {
        var origin = new Point(0, 0);
        var rotation = 0;
        return this._spatial.draw(origin, rotation);
    }
}

module.exports = Evostreet;

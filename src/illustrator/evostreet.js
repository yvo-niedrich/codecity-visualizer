var BaseIllustrator = require("./base.js");
var SHouse          = require("./shapes/house.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseIllustrator
 */
class Evostreet extends BaseIllustrator {
    constructor(model, options) {
        super(model, options);
        console.log(model, options);

        this._model = model;
        this._options = options;

        // Apply options

        this._spatial = this._createSpatialModel(this._model.tree);
    }

    _createSpatialModel(tree) {
        // create container
        if (!tree.children.length) {
            return this._createHouse(tree);
        }

        for (var child of tree.children) {
            var tmp = this._createSpatialModel(child);

            // Kategorisiere & Packe in entspr. Liste
            if (!tmp) {
                continue;
            } else if (tmp instanceof SHouse) {
                console.log(tmp);
            }
        }

        if (tree.parent === null) {
            // Root-Node => Highway
            // Append All Children
        } else {
            // Inner Node => Street
            // Append All Children
            //   Add Houses
            //   Add Container
        }
        // return self.container
    }

    _createHouse(node) {
        var house = new SHouse(node);
        // Apply Spatial properties
        return house;
    }
}

module.exports = Evostreet;

var BaseContainer = require("./base.js");

/**
 * Containers are able to mirror the placement algorithm on the X-Axis.
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class MirrorContainer extends BaseContainer {

    constructor(key, mirror = false) {
        super(key);
        this._mirrored = mirror;
    };

    add(shape) {
        if (this._mirrored) {
            shape.rotate(180);
        }

        super.add(shape);
    }

    get isMirrored() {
        return this._mirrored;
    }
}

module.exports = MirrorContainer;

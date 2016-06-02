/* eslint no-unused-vars: "off" */

var BaseContainer = require("./base.js");

/**
 * Containers are able to mirror the placement algorithm on the X-Axis.
 */
class MirrorContainer extends BaseContainer {

    constructor(key, mirror = false) {
        super(key);
        this._mirrored = mirror
    }

    /**
     * Adds shape to the container and honors mirroring
     * @param {BaseShape} shape
     */
    add(shape) {
        super.add(shape);

        if (this._mirrored) {
            shape.rotate(180);
        }
    }

    /**
     * @returns {boolean}
     */
    get isMirrored() {
        return this._mirrored;
    }
}

module.exports = MirrorContainer;

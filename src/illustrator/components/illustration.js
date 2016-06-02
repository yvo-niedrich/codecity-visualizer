/**
 * This is what a SoftwareModel has to look like
 */
class Illustration {

    /**
     * @param {Version} version
     */
    constructor(version) {
        this._version = version;
        this._shapes  = [];
    }

    /**
     * @returns {Version}
     */
    get version() {
        return this._version;
    }

    /**
     * @returns {Array}
     */
    get shapes() {
        return this._shapes;
    }

    /**
     * @param {BaseShape} shape
     */
    addShape(shape) {
        this._shapes.push(shape);
    }
}

module.exports = Illustration;
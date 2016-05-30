class Cuboid {
    constructor(length = 0, width = 0, height = 0) {
        this._length = length;
        this._width  = width;
        this._height = height;
    }

    /**
     * @returns {String}
     */
    toString() {
        return `[${this._width} x ${this.length} x ${this.height}]`;
    }

    /**
     * @param {number} length
     */
    set length(length) {
        this._length = length;
    }

    /**
     * @param {number} width
     */
    set width(width) {
        this._width = width;
    }

    /**
     * @param {number} height
     */
    set height(height) {
        this._height = height;
    }

    /**
     * @returns {number}
     */
    get length() {
        return this._length;
    }

    /**
     * @returns {number}
     */
    get width() {
        return this._width;
    }

    /**
     * @returns {number}
     */
    get height() {
        return this._height;
    }

    /**
     * @returns {number}
     */
    get diagonal() {
        return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }

    /**
     * @returns {number}
     */
    get base() {
        return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2));
    }
}

module.exports = Cuboid;

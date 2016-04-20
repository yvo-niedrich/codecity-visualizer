class Measure {
    constructor(width, length) {
        this._width  = width;
        this._length = length;
    }

    toString() {
        return `[${this._width} x ${this.length}]`;
    }

    get width() {
        return this._width;
    }

    get length() {
        return this._length;
    }

    set width(width) {
        this._width = width;
    }

    set length(length) {
        this._length = length;
    }
}

module.exports = Measure;

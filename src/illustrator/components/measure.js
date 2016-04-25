class Measure {
    constructor(length, width) {
        this._length = length;
        this._width  = width;
    };

    toString() {
        return `[${this._width} x ${this.length}]`;
    };

    get width() {
        return this._width;
    };

    get length() {
        return this._length;
    };

    set width(width) {
        this._width = width;
    };

    set length(length) {
        this._length = length;
    };
}

module.exports = Measure;

class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    };

    toString() {
        return `[${this._x}:${this.y}]`;
    };

    get x() {
        return this._x;
    };

    get y() {
        return this._y;
    };

    set x(x) {
        this._x = x;
    };

    set y(y) {
        this._y = y;
    };
}

module.exports = Point;

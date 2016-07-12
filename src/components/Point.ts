export class Point {
    _y: number;
    _x: number;
    _z: number;

    constructor(x?: number, y?: number, z?: number) {
        this._x = x ? x : 0;
        this._y = y ? y : 0;
        this._z = z ? z : 0;
    }

    toString(): string {
        return `[${this._x}:${this._y}:${this._z}]`;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get z(): number {
        return this._z;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    set z(z: number) {
        this._z = z;
    }
}

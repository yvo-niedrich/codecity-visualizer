export class Point implements PointInterface {
    private _y: number;
    private _x: number;
    private _z: number;

    constructor(x?: number, y?: number, z?: number) {
        this._x = x ? x : 0;
        this._y = y ? y : 0;
        this._z = z ? z : 0;
    }

    public toString(): string {
        return `[${this._x}:${this._y}:${this._z}]`;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    get z(): number {
        return this._z;
    }

    set z(z: number) {
        this._z = z;
    }
}

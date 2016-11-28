export class Cuboid implements CuboidInterface {
    private _length: number;
    private _width: number;
    private _height: number;

    constructor(length?: number, width?: number, height?: number) {
        this._length = length ? length : 0;
        this._width  = width ? width : 0;
        this._height = height ? height : 0;
    }

    public toString(): string {
        return `[${this._width} x ${this.length} x ${this.height}]`;
    }

    set length(length: number) {
        this._length = length;
    }

    get length(): number {
        return this._length;
    }

    set width(width: number) {
        this._width = width;
    }

    get width(): number {
        return this._width;
    }

    set height(height: number) {
        this._height = height;
    }

    get height(): number {
        return this._height;
    }

    get diagonal(): number {
        return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }

    get base(): number {
        return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2));
    }
}

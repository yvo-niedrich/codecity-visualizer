/**
 * This is what a SoftwareModel has to look like
 */
export class Illustration {
    private _version: VersionInterface;
    private _shapes: ShapeBaseAttributes[];

    constructor(version: VersionInterface) {
        this._version = version;
        this._shapes  = [];
    }

    get version(): VersionInterface {
        return this._version;
    }

    get shapes(): ShapeBaseAttributes[] {
        return this._shapes;
    }

    public addShape(shape: ShapeBaseAttributes): void {
        this._shapes.push(shape);
    }
}

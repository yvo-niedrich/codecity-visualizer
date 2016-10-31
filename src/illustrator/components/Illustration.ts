import {Version} from "../../components/Version";

/**
 * This is what a SoftwareModel has to look like
 */
export class Illustration {
    private _version: Version;
    private _shapes: Array<ShapeBaseAttributes>;

    constructor(version: Version) {
        this._version = version;
        this._shapes  = [];
    }

    get version(): Version {
        return this._version;
    }

    get shapes(): Array<ShapeBaseAttributes> {
        return this._shapes;
    }

    public addShape(shape: ShapeBaseAttributes): void {
        this._shapes.push(shape);
    }
}

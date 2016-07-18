import {Version} from '../../components/Version';
import {Shape} from './Shapes';

/**
 * This is what a SoftwareModel has to look like
 */
export class Illustration {
    private _version: Version;
    private _shapes: Array<Shape>;

    constructor(version: Version) {
        this._version = version;
        this._shapes  = [];
    }

    get version(): Version {
        return this._version;
    }

    /**
     * @returns {Array}
     */
    get shapes(): Array<Shape> {
        return this._shapes;
    }

    public addShape(shape: Shape): void {
        this._shapes.push(shape);
    }
}

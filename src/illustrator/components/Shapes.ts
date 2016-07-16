import {Cuboid} from '../../components/Cuboid';
import {Point} from '../../components/Point';

type ShapeBaseAttributes = {
    dimensions: Cuboid,
    key: string,
    margin: number,
    position: Point,
    rotation: number
};

/**
 * All shapes occupy a square area.
 * It's dimensions are described by the vector `dimensions`.
 * It can be placed and rotated around the shape's centroid.
 */
export abstract class Shape {
    protected _key: String;
    protected _hasBeenDrawn: boolean;
    protected _absolutePosition: Point;
    protected _absoluteRotation: number;
    private _attributes: ShapeBaseAttributes;

    constructor(key: string) {
        this._key = key;

        this._hasBeenDrawn = false;
        this._absolutePosition = null;
        this._absoluteRotation = 0;

        this._attributes = {
            dimensions: new Cuboid(),
            key: key,
            margin: 0,
            position: new Point(),
            rotation: 0
        };
    }

    /**
     * The shape's (and it's associated model node's) identifier
     */
    get key(): String {
        return this._key;
    }

    /**
     * Set the margin for this shape
     */
    set margin(margin: number) {
        this._attributes.margin = margin;
    }

    /**
     * Get the margin for this shape
     */
    get margin(): number {
        return this._attributes.margin;
    }

    /**
     * Get this shapes position, relative to it's parent's centroid
     * @return {Point}}
     * @protected
     */
    get position(): Point {
        return this._attributes.position;
    }

    /**
     * Get the shape's qubic footprint (before any rotation)
     * Intended only for private/protected use.
     * @return {Cuboid}
     * @protected
     */
    get dimensions(): Cuboid {
        return this._attributes.dimensions;
    }

    /**
     * Get the shape's qubic footprint (after any possible relative rotations)
     */
    get displayDimensions(): Cuboid {
        const swap = this.rotation % 180;
        const l = this.dimensions.length + 2 * this.margin;
        const w = this.dimensions.width  + 2 * this.margin;
        const h = this.dimensions.height + 2 * this.margin;
        return new Cuboid(
            swap ? w  : l,
            swap ? l : w,
            h
        );
    }

    /**
     * Get the shapes centroid (with relative rotation)
     */
    get centroid (): Point {
        return new Point(
            this.displayDimensions.length / 2,
            this.displayDimensions.width / 2
        );
    }

    /**
     * Get the relative rotation in degrees
     */
    get rotation(): number {
        return this._attributes.rotation;
    }

    /**
     * Convert Shape to String (it's key/name)
     */
    public toString(): string {
        return String(this._key);
    }

    /**
     * Rotate the shape around the it's centroid (clockwise rotation).
     */
    public rotate (degrees: number) {
        if (degrees % 90) {
            throw 'Only 90° rotations allowed';
        }

        this._attributes.rotation = (720 + this.rotation + degrees) % 360;
    }

    /**
     * Draw the Shape (calculate final absolute position and rotation)
     */
    public draw(parentPosition: Point, parentRotation: number) {
        const a = (720 - parentRotation) % 360;
        const rad = a * (Math.PI / 180);
        const transformedRelativePosition = new Point(
            Math.cos(rad) * this.position.x - Math.sin(rad) * this.position.y,
            Math.sin(rad) * this.position.x + Math.cos(rad) * this.position.y,
            this.position.z
        );

        this._absolutePosition = new Point(
            parentPosition.x + transformedRelativePosition.x,
            parentPosition.y + transformedRelativePosition.y,
            parentPosition.z + transformedRelativePosition.z
        );

        this._absoluteRotation = (360 + parentRotation + this.rotation) % 360;
        this._hasBeenDrawn = true;
    }

    /**
     * Draw the Shape
     */
    public getSpatialInformation(): Array<ShapeBaseAttributes> {
        if (!this._hasBeenDrawn) {
            throw 'Node has not been drawn yet';
        }

        const swap = this._absoluteRotation % 180;
        const rotatedDimensions = new Cuboid(
            swap ? this.dimensions.width  : this.dimensions.length,
            swap ? this.dimensions.length : this.dimensions.width,
            this.dimensions.height
        );

        let spatialInformation = Object.assign({}, this._attributes);

        spatialInformation.dimensions = rotatedDimensions;
        spatialInformation.position = this._absolutePosition;
        spatialInformation.rotation = this._absoluteRotation;

        return [ spatialInformation ];
    }

    /**
     * Updates the internal AttributeContainer for the SpatialInformation.
     * Also applies Spatial Data for this Shape directly.
     */
    public updateAttributes(attributes: Object) {
        for (let key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                const value = attributes[key];
                this.updateAttribute(this._attributes, key.split('.'), value);
            }
        }
    }

    /**
     * Returns the attribute recorded for key
     */
    public getAttribute(key: string): any {
        const keys = key.split('.');
        let attr = this._attributes;
        while (keys.length && attr) {
            attr = attr[keys.shift()];
        }
        return attr;
    }

    /**
     * Updates a single value within the attributes object
     */
    private updateAttribute(obj: Object, keys: Array<string>, value: any) {
        const k = keys.shift();
        if (!keys.length) {
            obj[k] = value;
        } else {
            if (!(k in obj)) {
                obj[k] = {};
            }
            this.updateAttribute(obj[k], keys, value);
        }
    }
}

export class House extends Shape {
    constructor(key) {
        super(key);
    }
}

export class Platform extends Shape {
    constructor(key) {
        super(key);
    }
}

export class Street extends Shape {
    constructor(key) {
        super(key);
    }
}
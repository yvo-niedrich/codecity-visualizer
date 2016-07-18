import {AttributeContainer} from '../../components/Interfaces';
import {applyMixins, Configurable, ConfigurableInterface} from '../components/Mixins';
import {Shape} from '../components/Shapes';
import {Point} from "../../components/Point";
import {Cuboid} from "../../components/Cuboid";

/**
 * A Shape-Container stores shapes and place them (relative to the containers origin).
 * The container will automatically finalize, once it is drawn or it's dimensions are requested.
 * All Containers implement the Configurable Feature
 * @implements Configurable
 */
abstract class Container extends Shape implements ConfigurableInterface {

    // Satisfy Configurable-Interface
    public setDefaults: (defaults: AttributeContainer) => void;
    public setOptions: (options: AttributeContainer) => void;
    public setOption: (key: string, value: any) => void;
    public getOption: (key: string) => any;
    public requireOption: (key: string) => void;

    private _elements: Array<Shape>;
    private _finalized: boolean;

    constructor(key: string) {
        super(key);
        this._elements = [];
        this._finalized = false;
    }

    /**
     * No more Shapes will be added to the Container. Place the available shapes,
     * and calculate the containers final dimensions
     */
    public abstract finalize(): void;

    /**
     * Get the amount of elements, this container will draw
     */
    get size(): number {
        return this._elements.length;
    }

    /**
     * Get all shapes of this container
     */
    get shapes(): Array<Shape> {
        return this._elements;
    }

    /**
     * Add a shape to the container
     */
    public add(shape: Shape): void {
        this._elements.push(shape);
    }

    /**
     * Get the spatial information for container and it's content
     * TODO: Fix Return Value
     */
    public getSpatialInformation(): any {
        let result: Array<any> = [];
        for (const shape of this._elements) {
            result = result.concat(shape.getSpatialInformation());
        }
        return result;
    }

    /**
     * Draws the container and all of it's shapes (after initiating finalizeOnce)
     */
    public draw(parentPosition: Point, parentRotation: number): void {
        this.finalizeOnce();
        super.draw(parentPosition, parentRotation);

        for (const shape of this._elements) {
            shape.draw(this._absolutePosition, this._absoluteRotation);
        }
    }

    /**
     * Get the containers dimensions (after initiating finalizeOnce)
     * @return {Cuboid}
     */
    get displayDimensions(): Cuboid {
        this.finalizeOnce();
        return super.displayDimensions;
    }

    /**
     * Will initiate the finalization (if it has not been called already)
     */
    private finalizeOnce(): void {
        if (!this._finalized) {
            this._finalized = true;
            this.finalize();
        }
    }
}

applyMixins(Container, [Configurable]);

abstract class SpecificContainer extends Container {
    constructor(key: string, options: AttributeContainer) {
        super(key);
        this.setOptions(options);
    }
}

abstract class UniversalContainer extends Container {
    private _mirrored: boolean;

    constructor(key: string, mirror: boolean = false) {
        super(key);
        this._mirrored = mirror;
    }

    /**
     * Adds shape to the container and honors mirroring
     */
    public add(shape: Shape): void {
        super.add(shape);

        if (this._mirrored) {
            shape.rotate(180);
        }
    }

    get isMirrored(): boolean {
        return this._mirrored;
    }
}

export {Container, SpecificContainer, UniversalContainer};

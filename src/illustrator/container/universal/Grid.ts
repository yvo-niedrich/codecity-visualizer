import {UniversalContainer} from "../Container";
import {Shape} from "../../components/Shapes";
import {Cuboid} from "../../../components/Cuboid";
import {RowContainer} from "./Row";

/**
 * Strip is a helper class for the GRID-Algorithm.
 * It's contents shall not be shared. with other classes.
 */
class Strip {
    private _offset: number;
    private _dimensions: Cuboid;
    private _container: RowContainer;

    constructor(name: string, mirrored: boolean) {
        this._offset = 0;
        this._dimensions = new Cuboid();
        this._container = new RowContainer(name, mirrored);

        if (mirrored) {
            this._container.rotate(180);
        }
    }

    get container() {
        return this._container;
    }

    get dimensions() {
        return this._dimensions;
    }

    get offset() {
        return this._offset;
    }

    set offset(val) {
        this._offset = val;
    }

    public add(shape: Shape): boolean {
        const recommendOffsetRecalculation = this.dimensions.length &&
                                            this.dimensions.width < shape.displayDimensions.width;

        this.dimensions.length += shape.displayDimensions.length;
        this.dimensions.width  = Math.max(this.dimensions.width, shape.displayDimensions.width);
        this.dimensions.height = Math.max(this.dimensions.height, shape.displayDimensions.height);

        this._container.add(shape);

        return recommendOffsetRecalculation;
    }
}

/**
 * Rows Elements one after the other
 */
export class GridContainer extends UniversalContainer {
    private _shapes: Array<Shape>;
    private _strips: Array<Strip>;
    private _activeStrip: number;

    constructor(key: string, mirror: boolean = false) {
        super(key, mirror);

        this.setDefaults({
            optimalAspectRatio: 1.0
        });

        this._shapes = [];
        this._strips = [];
        this._activeStrip = -1;
    }

    public add(shape: Shape): void {
        this._shapes.push(shape);
    }

    public finalize(): void {
        if (!this._shapes.length) {
            return;
        }

        this.createNewStrip();
        this._activeStrip = 0;

        this.calculateGrid();
        this.calculateFinalDimensions();
        this.positionStrips();

        for (const s of this._strips) {
            super.add(s.container);
        }
    }

    private calculateGrid() {
        while (this._shapes.length) {
            const strip = this._strips[this._activeStrip];
            const shape = this._shapes.shift();

            // 1) If a new Strip was just created, add the shape
            //    And then return the pointer to the first strip
            if (!strip.dimensions.length) {
                strip.add(shape);
                this._activeStrip = 0;
                continue;
            }

            // 2) Will the new shape impare the aspect ratio?
            const currentDimensions = this.getCurrentDimensions();
            const newLength = strip.dimensions.length + shape.displayDimensions.length;
            if (newLength / currentDimensions.width > this.getOption('optimalAspectRatio')) {
                // 2.1) Inserting the Shape would impare aspect ratio
                //      Try again on the next strip

                // If this is the last strip, create a new strip
                if (this._activeStrip + 1 === this._strips.length) {
                    this.createNewStrip();
                }

                this._shapes.unshift(shape);
                this._activeStrip++;

            } else {
                // 2.2) The Shape will not impair the aspect ratio on 
                //    the current strip. Insert the shape.
                const updateOffsets = strip.add(shape);

                if (updateOffsets) {
                    this.recalculateStripOffsets();
                }
            }
        }
    }

    private createNewStrip(): void {
        const rowName = this.key + '_r' + this._strips.length;
        this._strips.push(new Strip(rowName, this.isMirrored));
        this.recalculateStripOffsets();
    }

    private recalculateStripOffsets(): void {
        let offset = 0;
        for (let i = 0; i < this._strips.length; i++) {
            this._strips[i].offset = offset;
            offset += this._strips[i].dimensions.width;
        }
    }

    private getCurrentDimensions(): Cuboid {
        const d = new Cuboid();

        for (const s of this._strips) {
            d.length = Math.max(d.length, s.dimensions.length);
            d.width += s.dimensions.width;
            d.height = Math.max(d.height, s.dimensions.height);
        }

        return d;
    }

    private calculateFinalDimensions(): void {
        const d = this.getCurrentDimensions();
        this.dimensions.length = d.length;
        this.dimensions.width  = d.width;
        this.dimensions.height = d.height;
    }

    private positionStrips(): void {
        for (const strip of this._strips) {
            strip.container.position.x = (strip.dimensions.length - this.dimensions.length) / 2;
            strip.container.position.y = this.calculateYAxisPosition(strip.offset, strip.dimensions.width);
        }
    }

    private calculateYAxisPosition(offset: number, width: number): number {
        const rowPosOffset = offset + (width / 2);
        const origin = this.dimensions.width / 2;

        return this.isMirrored ? (origin - rowPosOffset) : (rowPosOffset - origin);
    }
}

import {UniversalContainer} from "../Container";
import {Shape} from "../../components/Shapes";
import {Cuboid} from "../../../components/Cuboid";
import {RowContainer} from "./Row";

/**
 * Strip is a helper class for the GRID-Algorithm.
 * It"s contents shall not be shared. with other classes.
 */
class Strip {
    private _offset: number;
    private _dimensions: CuboidInterface;
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
        const recommendOffsetRecalculation = this.dimensions.length > 0 &&
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
    private _shapes: Shape[];
    private _strips: Strip[];

    constructor(key: string, mirror: boolean = false) {
        super(key, mirror);

        this.setDefaults({
            optimalAspectRatio: 1.0,
            useBestFitMethod: true
        });

        this._shapes = [];
        this._strips = [];
    }

    get size(): number {
        if (this._shapes.length) {
            return this._shapes.length;
        }

        if (this._strips.length) {
            return this._strips
                .map((v: Strip) => v.container.size)
                .reduce((a, b) => (a + b));
        }

        return 0;
    }

    public add(shape: Shape): void {
        this._shapes.push(shape);
    }

    public finalize(): void {
        if (!this._shapes.length) {
            return;
        }

        this.calculateGrid();
        this.calculateFinalDimensions();
        this.positionStrips();

        for (const s of this._strips) {
            super.add(s.container);
        }
    }

    private calculateGrid() {
        // An initial Strip is required
        this.createNewStrip();

        let activeStrip: number = 0;
        const bestFit: { aspectDistance: number; strip: number; } = {
            aspectDistance: Infinity,
            strip: -1
        };

        while (this._shapes.length) {
            const strip = this._strips[activeStrip];
            const shape = this._shapes.shift() as Shape;

            // 1) If a new Strip was just created or this is the best fit, add the shape here
            //    And then return the pointer to the first strip
            if (!strip.dimensions.length || bestFit.strip === activeStrip) {
                this.addAndRecalculate(strip, shape);

                activeStrip = 0;
                bestFit.aspectDistance = Infinity;
                bestFit.strip = -1;
                continue;
            }

            // 2) Will the new shape impare the aspect ratio?
            const currentDimensions = this.getCurrentDimensions();
            const newLength = Math.max(strip.dimensions.length + shape.displayDimensions.length, currentDimensions.length);

            const possibleAspectRatio = this.getAspectRatio(newLength, currentDimensions.width);
            const possibleAspectRatioDist = Math.abs(possibleAspectRatio - this.getOption("optimalAspectRatio"));

            const currentAspectRatio = this.getAspectRatio(currentDimensions.width, currentDimensions.length);
            const currentAspectRatioDist = Math.abs(currentAspectRatio - this.getOption("optimalAspectRatio"));

            const aspectRatioImpaired = possibleAspectRatioDist > currentAspectRatioDist;

            if (aspectRatioImpaired) {
                // 2.1) Inserting the Shape would impare aspect ratio

                // Store the Strip, because adding a new strip might be worse
                // than inserting the shape here
                if (possibleAspectRatioDist < bestFit.aspectDistance) {
                    bestFit.aspectDistance = possibleAspectRatioDist;
                    bestFit.strip = activeStrip;
                }

                // If this is the last strip, check if inserting a new
                // strip is better, than using any of the available strips.
                const isLastStrip = activeStrip + 1 === this._strips.length;
                let gotoBestFit = false;
                if (this.getOption("useBestFitMethod") && isLastStrip) {
                    const widthWithNewStrip = currentDimensions.width + shape.displayDimensions.width;
                    const newStripAspectRatio = this.getAspectRatio(currentDimensions.length, widthWithNewStrip);
                    const newStripAspectRatioDist = Math.abs(newStripAspectRatio - this.getOption("optimalAspectRatio"));
                    gotoBestFit = newStripAspectRatioDist > bestFit.aspectDistance;
                }

                if (isLastStrip && !gotoBestFit) {
                    this.createNewStrip();
                }

                // Try again on the next strip or best fitting position
                this._shapes.unshift(shape);
                activeStrip = gotoBestFit ? bestFit.strip : activeStrip + 1;

            } else {
                // 2.2) The Shape will not impair the aspect ratio on
                //      the current strip. Insert the shape and
                //      return strip pointer.
                this.addAndRecalculate(strip, shape);

                activeStrip = 0;
                bestFit.aspectDistance = Infinity;
                bestFit.strip = -1;
            }
        }
    }

    private createNewStrip(): void {
        const rowName = this.key + "_r" + this._strips.length;
        this._strips.push(new Strip(rowName, this.isMirrored));
        this.recalculateStripOffsets();
    }

    private getAspectRatio(length: number, width: number): number {
        return Math.max(length, width) / Math.min(length, width);
    }

    private addAndRecalculate(strip: Strip, shape: Shape): void {
        if (strip.add(shape)) {
            this.recalculateStripOffsets();
        }
    }

    private recalculateStripOffsets(): void {
        let offset = 0;
        for (const strip of this._strips) {
            strip.offset = offset;
            offset += strip.dimensions.width;
        }
    }

    private getCurrentDimensions(): CuboidInterface {
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

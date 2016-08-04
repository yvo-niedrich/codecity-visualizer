import {UniversalContainer} from "../Container";

/**
 * Rows Elements one after the other
 */
export class LineContainer extends UniversalContainer {
    constructor(key: string, mirror: boolean = false) {
        super(key, mirror);
    }

    public finalize() {
        if (!this.size) {
            return;
        }

        this.calculateFinalDimensions();
        this.positionShapes();
    }

    private calculateFinalDimensions() {
        for (const shape of this.shapes) {
            this.dimensions.length += shape.displayDimensions.length;
            this.dimensions.width   = Math.max(shape.displayDimensions.width, this.dimensions.width);
            this.dimensions.height  = Math.max(shape.displayDimensions.height, this.dimensions.height);
        }
    }

    private positionShapes() {
        let firstFreePosition = -(this.dimensions.length / 2);

        for (const shape of this.shapes) {
            shape.position.x = firstFreePosition + (shape.displayDimensions.length / 2);
            shape.position.y = 0;

            firstFreePosition += shape.displayDimensions.length;
        }
    }
}

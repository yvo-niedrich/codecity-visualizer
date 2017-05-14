import {UniversalContainer} from "../Container";
import {Shape, Platform} from "../../components/Shapes";
import {LineContainer} from "./Line";

/**
 * Rows Elements one after the other
 */
export class PlatformContainer extends UniversalContainer {
    private elements: UniversalContainer;

    constructor(key: string, mirror: boolean = false) {
        super(key, mirror);
        this.setDefaults({
            "dimensions.height": 10,
            "color": 0x000000
        });

        this.elements = new LineContainer(key, mirror);
        super.add(this.elements);
    }

    get size(): number {
        return this.elements.size;
    }

    public add(shape: Shape): void {
        this.elements.add(shape);
    }

    public finalize() {
        if (!this.elements.size) {
            return;
        }

        const d = this.elements.displayDimensions;

        this.dimensions.length = d.length;
        this.dimensions.width  = d.width;
        this.dimensions.height = d.height;

        this.createPlatform();
    }

    private createPlatform(): void {
        const platform = new Platform(this.key);

        const platformOptions: AttributeContainer = Object.assign({
            "dimensions.length": this.dimensions.length,
            "dimensions.width": this.dimensions.width
        }, this.getOptions());

        platform.updateAttributes(platformOptions);

        // Lift everything else above the platform
        const platformHeight = platform.dimensions.height;
        platform.position.z = -platformHeight;
        this.position.z = platformHeight + this.position.z;

        super.add(platform);
    }
}

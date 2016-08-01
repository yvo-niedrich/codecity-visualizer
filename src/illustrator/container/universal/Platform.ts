import {UniversalContainer} from "../Container";
import {RowContainer} from "./Row";
import {Shape, Platform} from "../../components/Shapes";
import {AttributeContainer} from "../../../components/Interfaces";

/**
 * Rows Elements one after the other
 */
export class PlatformContainer extends UniversalContainer {
    private elements: RowContainer;

    constructor(key: string, mirror: boolean = false) {
        super(key, mirror);
        this.setDefaults({
            "dimensions.height": 5,
            "color": 0x000000
        });

        this.elements = new RowContainer(key + "_row", mirror);
        super.add(this.elements);
    }

    public add(shape: Shape): void {
        this.elements.add(shape);
    }

    public finalize() {
        if (!this.elements.size) {
            return;
        }

        let d = this.elements.displayDimensions;

        this.dimensions.length = d.length;
        this.dimensions.width  = d.width;
        this.dimensions.height = d.height;

        this.createPlatform();
    }

    private createPlatform(): void {
        const platform = new Platform(this.key);

        let platformOptions: AttributeContainer = Object.assign({
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

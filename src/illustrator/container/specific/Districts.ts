import {SpecificContainer, UniversalContainer, Container} from "../Container";
import {AttributeContainer} from "../../../components/Interfaces";
import {Lightmap} from "../universal/Lightmap";
import {Platform, Shape, House} from "../../components/Shapes";

// TODO: Segmentorder --> NULL | function
export interface DistrictContainerOptions extends AttributeContainer {
    "spacer.margin"?: number;
    "spacer.padding"?: number;

    "houses.container"?: UniversalContainer;
    "houses.options"?: boolean;

    "district.container"?: UniversalContainer;
    "district.options"?: boolean;
}

/**
 * Create an District Layout City Container
 */
export class DistrictContainer extends SpecificContainer {
    private _container: {
        houses: UniversalContainer,
        districts: UniversalContainer,
        platform: Platform
    };

    constructor(key: string, options: DistrictContainerOptions = {}) {
        super(key, options);
        this.setDefaults({
            "spacer.margin": 10,
            "spacer.padding": 5,

            "houses.container": Lightmap,
            "houses.options": false,

            "district.container": Lightmap,
            "district.options": false
        });

        const districtContainer = this.getOption("district.container");
        const houseContainer = this.getOption("houses.container");

        this._container = {
            "houses": new houseContainer(this.key + "_d", this.getOption("houses.options")),
            "districts": new districtContainer(this.key + "_d", this.getOption("district.options")),
            "platform": null
        };
        super.add(this._container.districts);
    }

    public add(shape: Shape) {
        if (shape instanceof Container) {
            this._container.districts.add(shape);
        } else if (shape instanceof House) {
            this._container.houses.add(shape);
        } else if (shape instanceof Platform) {
            if (this._container.platform !== null) {
                throw "DistrictContainer can only have one platform.";
            }

            this._container.platform = shape;
        } else {
            throw "Unknown Shape Type: " + shape;
        }
    }

    public finalize(): void {
        this._container.districts.add(this._container.houses);

        const padding = 2 * this.getOption("spacer.padding");
        this.dimensions.length = this._container.districts.displayDimensions.length + padding;
        this.dimensions.width  = this._container.districts.displayDimensions.width + padding;
        this.dimensions.height  = this._container.districts.displayDimensions.height;

        this.createPlatform();
        this.margin = this.getOption("spacer.margin");
    }

    private createPlatform(): void {
        if (!this._container.platform) {
            this._container.platform = new Platform(this.key + "_p");
        }

        this._container.platform.dimensions.length = this.dimensions.length;
        this._container.platform.dimensions.width = this.dimensions.width;

        // Lift everything else above the platform
        const platformHeight = this._container.platform.dimensions.height;
        this._container.platform.position.z = -platformHeight;
        this.position.z = platformHeight + this.position.z;

        super.add(this._container.platform);
    }
}

import {SpecificContainer, UniversalContainer, Container} from "../Container";
import {AttributeContainer} from "../../../components/Interfaces";
import {Lightmap} from "../universal/Lightmap";
import {Shape, House} from "../../components/Shapes";
import {PlatformContainer} from "../universal/Platform";

export interface DistrictContainerOptions extends AttributeContainer {
    "spacer.margin"?: number;
    "spacer.padding"?: number;

    "houses.container"?: UniversalContainer;
    "houses.options"?: boolean;

    "district.container"?: UniversalContainer;
    "district.options"?: boolean;

    "platform.container"?: PlatformContainer;
    "platform.options"?: boolean;
    "platform.attributes"?: AttributeContainer;
}

/**
 * Create an District Layout City Container
 */
export class DistrictContainer extends SpecificContainer {
    private houses: UniversalContainer;
    private districts: UniversalContainer;
    private platform: PlatformContainer;

    constructor(key: string, options: DistrictContainerOptions = {}) {
        super(key, options);
        this.setDefaults({
            "spacer.margin": 10,
            "spacer.padding": 5,

            "houses.container": Lightmap,
            "houses.options": false,

            "district.container": Lightmap,
            "district.options": false,

            "platform.container": PlatformContainer,
            "platform.options": false,
            "platform.attributes": {}
        });

        const districtContainer = this.getOption("district.container");
        const houseContainer = this.getOption("houses.container");
        const platformContainer = this.getOption("platform.container");

        this.houses = new houseContainer(this.key + "_d", this.getOption("houses.options"));
        this.districts = new districtContainer(this.key + "_d", this.getOption("district.options"));
        this.platform = new platformContainer(this.key, this.getOption("platform.options"));
        this.platform.setOptions(this.getOption("platform.attributes"));
        super.add(this.platform);
    }

    public add(shape: Shape) {
        if (shape instanceof Container) {
            this.districts.add(shape);
        } else if (shape instanceof House) {
            this.houses.add(shape);
        } else {
            throw "Unknown Shape Type: " + shape;
        }
    }

    public finalize(): void {
        // treat houses as one last district then put everything
        // on top of the platform
        this.districts.add(this.houses);
        this.platform.add(this.districts);

        this.platform.margin = this.getOption("spacer.padding");
        this.margin = this.getOption("spacer.margin");

        this.dimensions.length = this.platform.displayDimensions.length;
        this.dimensions.width  = this.platform.displayDimensions.width;
        this.dimensions.height = this.platform.displayDimensions.height;
    }
}

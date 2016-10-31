import {SpecificContainer, UniversalContainer, Container} from "../Container";
import {Lightmap} from "../universal/Lightmap";
import {Shape, House} from "../../components/Shapes";
import {PlatformContainer} from "../universal/Platform";

type containerFunction = (s: string, m: boolean) => UniversalContainer;

export interface DistrictContainerOptions extends AttributeContainer {
    "spacer.margin"?: number;
    "spacer.padding"?: number;

    "houses.container"?: containerFunction;
    "district.container"?: containerFunction;
    "platform.container"?: (s: string, m: boolean) => PlatformContainer;
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

        const defaults: DistrictContainerOptions = {
            "spacer.margin": 10,
            "spacer.padding": 5,

            "houses.container": (k: string, m: boolean) => new Lightmap(k, m),
            "district.container": (k: string, m: boolean) => new Lightmap(k, m),
            "platform.container": (k: string, m: boolean) => new PlatformContainer(k, m)
        };
        this.setDefaults(defaults);

        const districtContainer = this.getOption("district.container");
        const houseContainer = this.getOption("houses.container");
        const platformContainer = this.getOption("platform.container");

        this.houses = houseContainer(this.key + "_d", false);
        this.districts = districtContainer(this.key + "_d", false);
        this.platform = platformContainer(this.key, false);
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

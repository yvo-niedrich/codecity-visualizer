import {Illustrator} from "./Illustrator";
import {SpecificContainer} from "./container/Container";
import {DistrictContainer, DistrictContainerOptions} from "./container/specific/Districts";
import {Point} from "../components/Point";
import {Illustration} from "./components/Illustration";
import {Shape, House} from "./components/Shapes";
import {PlatformContainer} from "./container/universal/Platform";

export interface DistrictOptions extends AttributeContainer {
    "layout.tower"?: boolean;
    "house.length"?: number;
    "house.width"?: number;
    "house.height"?: number;
    "house.margin"?: number;
    "house.color"?: number;
    "platform.height"?: number;
    "platform.color"?: number;
    "district.container"?: SpecificContainer;
    "district.options"?: DistrictContainerOptions;
}

/**
 * Create an District Layout City
 */
export class District extends Illustrator {
    private _model: SoftwareModel;

    constructor(model: SoftwareModel, options: DistrictOptions = {}) {
        super();

        this.setOptions(options);
        this.setDefaults({
            "layout.tower": true,

            "house.length": 12,
            "house.width": 12,
            "house.height": 12,
            "house.margin": 3,
            "house.color": 0x1A212E,

            "platform.height": 10,
            "platform.color": 0x000000,

            "district.container": DistrictContainer,
            "district.options": {}
        });

        this._model = model;
    }

    public draw(version: VersionInterface): Illustration {
        const spatialModel = this.createSpatialModel(this._model.getTree(), version);

        const origin = new Point(0, 0, 0);
        const rotation = 0;
        spatialModel.draw(origin, rotation);

        const illustration = new Illustration(version);
        for (const shape of spatialModel.getSpatialInformation()) {
            illustration.addShape(shape);
        }

        return illustration;
    }

    private createSpatialModel(tree: TreeNodeInterface, version: VersionInterface): Shape {
        if (!tree.children.length) {
            return this.createHouse(tree, version);
        }

        if (this.preventTower(tree)) {
            return this.createSpatialModel(tree.children[0], version);
        }

        const container = this.createContainer(tree, version);

        for (const child of tree.children) {
            if (this._model.exists(child, version)) {
                container.add(this.createSpatialModel(child, version));
            }
        }

        return container;
    }

    private preventTower(node: TreeNodeInterface): boolean {
        return !this.getOption("layout.tower") &&
            node.children.length === 1 &&
            node.children[0].children.length > 0;
    }

    private createContainer(node: TreeNodeInterface, version: VersionInterface): SpecificContainer {
        const cClass = this.getOption("district.container");

        const cOptions: DistrictContainerOptions = Object.assign({}, this.getOption("district.options"));

        const platformOptions = this.applyRules(this._model, node, version);

        // TODO: Fix this!
        let oldFunc: (s: string, m: boolean) => PlatformContainer;
        if (cOptions["platform.container"] !== undefined) {
            oldFunc = cOptions["platform.container"] as (s: string, m: boolean) => PlatformContainer;
        } else {
            oldFunc = (s: string, m: boolean) => new PlatformContainer(s, m);
        }

        cOptions["platform.container"] = (s: string, m: boolean) => {
            const o = oldFunc(s, m);
            for (const key in platformOptions) {
                if (platformOptions.hasOwnProperty(key)) {
                    o.setOption(key, platformOptions[key]);
                }
            }
            return o;
        };

        return new cClass(String(node), cOptions);
    }

    private createHouse(node: TreeNodeInterface, version: VersionInterface): House {
        const defaultLayout = {
            "dimensions.length": this.getOption("house.length"),
            "dimensions.width": this.getOption("house.width"),
            "dimensions.height": this.getOption("house.height"),
            "margin": this.getOption("house.margin"),
            "color": this.getOption("house.color")
        };

        const house = new House(String(node));
        house.updateAttributes(Object.assign(defaultLayout, this.applyRules(this._model, node, version)));

        return house;
    }
}

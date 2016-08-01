import {Illustrator} from "./Illustrator";
import {Model} from "../model/Model";
import {AttributeContainer} from "../components/Interfaces";
import {SpecificContainer} from "./container/Container";
import {DistrictContainer, DistrictContainerOptions} from "./container/specific/Districts";
import {Version} from "../components/Version";
import {Point} from "../components/Point";
import {Illustration} from "./components/Illustration";
import {TreeNode} from "../components/TreeNode";
import {Shape, House} from "./components/Shapes";

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
    private _model: Model;

    constructor(model: Model, options: DistrictOptions = {}) {
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

    public draw(version: Version): Illustration {
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

    private createSpatialModel(tree: TreeNode, version: Version): Shape {
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

    private preventTower(node: TreeNode): boolean {
        return !this.getOption("layout.tower") &&
            node.children.length === 1 &&
            node.children[0].children.length > 0;
    }

    private createContainer(node: TreeNode, version: Version): SpecificContainer {
        const cClass = this.getOption("district.container");

        const defaultLayout = {
            "color": this.getOption("platform.color"),
            "dimensions.height": this.getOption("platform.height")
        };

        let cOptions: DistrictContainerOptions = Object.assign({}, this.getOption("district.options"));
        cOptions["platform.attributes"] = Object.assign(
            defaultLayout,
            cOptions["platform.attributes"],
            this.applyRules(node, this._model, version)
        );

        return new cClass(String(node), cOptions);
    }

    private createHouse(node: TreeNode, version: Version): House {
        const defaultLayout = {
            "dimensions.length": this.getOption("house.length"),
            "dimensions.width": this.getOption("house.width"),
            "dimensions.height": this.getOption("house.height"),
            "margin": this.getOption("house.margin"),
            "color": this.getOption("house.color")
        };

        const house = new House(String(node));
        house.updateAttributes(Object.assign(defaultLayout, this.applyRules(node, this._model, version)));

        return house;
    }
}

import {SpecificContainer} from "./container/Container";
import {Illustrator} from "./Illustrator";
import {StreetContainer, StreetContainerOptions} from "./container/specific/Streets";
import {Illustration} from "./components/Illustration";
import {Point} from "../components/Point";
import {Shape, Street, House, Highway} from "./components/Shapes";

export interface EvostreetOptions extends AttributeContainer {
    "layout.snail"?: boolean;
    "highway.length"?: number;
    "highway.color"?: number;
    "street.length"?: number;
    "street.color"?: number;
    "house.length"?: number;
    "house.width"?: number;
    "house.height"?: number;
    "house.margin"?: number;
    "house.color"?: number;
    "evostreet.container"?: SpecificContainer;
    "evostreet.options"?: StreetContainerOptions;
}

/**
 * Create an Evostreet Layout city
 */
export class Evostreet extends Illustrator {
    private _model: SoftwareModel;

    constructor(model: SoftwareModel, options: EvostreetOptions = {}) {
        super();

        this._model = model;
        this.setOptions(options);
        this.setDefaults({
            "layout.snail": true,

            "highway.length": 45,
            "highway.color": 0x156289,

            "street.length": 20,
            "street.color": 0x156289,

            "house.length": 12,
            "house.width": 12,
            "house.height": 12,
            "house.margin": 3,
            "house.color": 0x1A212E,

            "evostreet.container": StreetContainer,
            "evostreet.options": {}
        });
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

    private createSpatialModel(tree: TreeNodeInterface, version: VersionInterface, skippedRoot: boolean = false): Shape {
        if (!tree.children.length) {
            return this.createHouse(tree, version);
        }

        if (this.preventSnail(tree)) {
            return this.createSpatialModel(tree.children[0], version, skippedRoot || tree.parent === null);
        }

        const container = this.createContainer(tree);
        container.add(this.createRoad(tree, version, skippedRoot));

        for (const child of tree.children) {
            container.add(this.createSpatialModel(child, version));
        }

        return container;
    }

    private preventSnail(node: TreeNodeInterface): boolean {
        return !this.getOption("layout.snail") &&
            node.children.length === 1 &&
            node.children[0].children.length > 0;
    }

    private createContainer(node: TreeNodeInterface): SpecificContainer {
        const cClass = this.getOption("evostreet.container");
        return new cClass(String(node), this.getOption("evostreet.options"));
    }

    private createRoad(node: TreeNodeInterface, version: VersionInterface, forceRoot: boolean = false): Street {
        if (node.parent === null || forceRoot) {
            return this.createHighway(node, version);
        } else {
            return this.createStreet(node, version);
        }
    }

    private createHighway(node: TreeNodeInterface, version: VersionInterface): Street {
        const defaultLayout = {
            "dimensions.length": this.getOption("highway.length"),
            "dimensions.height": 1,
            "color": this.getOption("highway.color")
        };

        const highway = new Highway(String(node));
        highway.updateAttributes(Object.assign(defaultLayout, this.applyRules(this._model, node, version)));
        return highway;
    }

    private createStreet(node: TreeNodeInterface, version: VersionInterface): Street {
        const defaultLayout = {
            "dimensions.length": this.getOption("street.length"),
            "dimensions.height": 1,
            "color": this.getOption("street.color")
        };

        const street = new Street(String(node));
        street.updateAttributes(Object.assign(defaultLayout, this.applyRules(this._model, node, version)));
        return street;
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

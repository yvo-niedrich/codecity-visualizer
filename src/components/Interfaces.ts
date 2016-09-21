import {Cuboid} from "./Cuboid";
import {Dependency} from "./Dependency";
import {TreeNode} from "./TreeNode";
import {Point} from "./Point";
import {Version} from "./Version";

export interface AttributeContainer {
    [index: string]: any;
}

export interface ShapeAttributes extends AttributeContainer {
    type?: string;
    "dimensions.length"?: number;
    "dimensions.width"?: number;
    "dimensions.height"?: number;
    "position.x"?: number;
    "position.y"?: number;
    "position.z"?: number;
    rotation?: number;
}

export interface ShapeBaseAttributes extends AttributeContainer {
    type: string;
    dimensions: Cuboid;
    key: string;
    margin: number;
    position: Point;
    rotation: number;
}

export interface SoftwareModel {
    /* Get the Models Graph. A List of Dependencies, connecting `source` and `target`. */
    getGraph(): Array<Dependency>;

    /* Get the Root-Node of the tree. */
    getTree(): TreeNode;

    /* Get an ordered List of all versions. */
    getVersions(): Array<Version>;

    /* Existence Function */
    exists(node: TreeNode, version: Version): Boolean;

    /* Property function */
    getAttributes(node: TreeNode, version: Version): AttributeContainer;
}
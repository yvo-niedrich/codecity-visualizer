declare interface AttributeContainer {
    [index: string]: any;
}

declare interface ShapeAttributes extends AttributeContainer {
    type?: string;
    "dimensions.length"?: number;
    "dimensions.width"?: number;
    "dimensions.height"?: number;
    "position.x"?: number;
    "position.y"?: number;
    "position.z"?: number;
    rotation?: number;
}

declare interface ShapeBaseAttributes extends AttributeContainer {
    type: string;
    dimensions: CuboidInterface;
    key: string;
    margin: number;
    position: PointInterface;
    rotation: number;
}

declare interface CuboidInterface {
    length: number;
    width: number;
    height: number;
    diagonal: number;
    base: number;
}

declare interface DependencyInterface {
    source: TreeNodeInterface;
    target: TreeNodeInterface;
}

declare interface PointInterface {
    y: number;
    x: number;
    z: number;
}

declare interface TreeNodeInterface {
    children: TreeNodeInterface[];
    parent: TreeNodeInterface | null;
    add(child: string | TreeNodeInterface): TreeNodeInterface;
    find(key: TreeNodeInterface|string): TreeNodeInterface | null;
}

declare interface VersionInterface {
    key: string;
    label: string;
}

declare interface SoftwareModel {
    getGraph(): DependencyInterface[];
    getTree(): TreeNodeInterface;
    getVersions(): VersionInterface[];
    exists(node: TreeNodeInterface, version: VersionInterface): Boolean;
    getAttributes(node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
}
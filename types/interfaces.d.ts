/* tslint:disable */
import {Cuboid, Point} from "./components";
import {Platform as PlatformContainer, SpecificContainer, UniversalContainer} from "./containers";
import {Shape} from "./shapes";

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

export interface ConfigurableInterface {
    setDefaults: (defaults: AttributeContainer) => void;
    setOptions: (options: AttributeContainer) => void;
    setOption: (key: string, value: any) => void;
    getOption: (key: string) => any;
    getOptions: () => AttributeContainer;
    requireOption: (key: string) => void;
}

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

export abstract class Configurable implements ConfigurableInterface {
    public setDefaults: (defaults: AttributeContainer) => void;
    public setOptions: (options: AttributeContainer) => void;
    public setOption: (key: string, value: any) => void;
    public getOption: (key: string) => any;
    public getOptions: () => AttributeContainer;
    public requireOption: (key: string) => void;
}

type containerFunction = (key: string, mirror: boolean) => UniversalContainer;

export interface DistrictContainerOptions extends AttributeContainer {
    "spacer.margin"?: number;
    "spacer.padding"?: number;

    "houses.container"?: containerFunction;
    "district.container"?: containerFunction;
    "platform.container"?: (s: string, m: boolean) => PlatformContainer;
}

type distributionFunction = (s: Shape) => number;
type distributionString = "left" | "right" | "default";
type distributionMethod = distributionString | distributionFunction;


export interface StreetContainerOptions extends AttributeContainer {
    "spacer.initial"?: number;
    "spacer.branches"?: number;
    "spacer.terranullius"?: number;
    "spacer.conclusive"?: number;

    "house.container"?: containerFunction;
    "house.distribution"?: distributionMethod;
    "house.segmentation"?: { (s: Shape): string };
    "house.segmentorder"?: { (a: string, b: string): number };
    "house.platforms"?: null | ShapeAttributes;
    "house.path"?: null | ShapeAttributes;

    "branch.container"?: containerFunction;
    "branch.distribution"?: distributionMethod;
    "branch.segmentation"?: { (s: Shape): string };
    "branch.segmentorder"?: { (a: string, b: string): number };
}

export interface CuboidInterface {
    length: number;
    width: number;
    height: number;
    diagonal: number;
    base: number;
}

export interface DependencyInterface {
    source: TreeNodeInterface;
    target: TreeNodeInterface;
}

export interface PointInterface {
    y: number;
    x: number;
    z: number;
}

export interface TreeNodeInterface {
    children: Array<TreeNodeInterface>;
    parent: TreeNodeInterface | null;
    add(child: string | TreeNodeInterface): TreeNodeInterface;
    find(key: TreeNodeInterface|string): TreeNodeInterface | null;
}

export interface VersionInterface {
    key: string;
    label: string;
}

export interface SoftwareModel {
    getGraph(): Array<DependencyInterface>;
    getTree(): TreeNodeInterface;
    getVersions(): Array<VersionInterface>;
    exists(node: TreeNodeInterface, version: VersionInterface): Boolean;
    getAttributes(node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
}
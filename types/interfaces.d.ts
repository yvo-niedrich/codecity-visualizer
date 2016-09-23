/* tslint:disable */
import {Cuboid, Point} from "./components"

// TODO: Classes
class SpecificContainer {}
class UniversalContainer {}
class DistrictContainerOptions {}
class StreetContainerOptions {}

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
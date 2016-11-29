/* tslint:disable */

import {Point} from "./components";
import {
    AttributeContainer,
    ConfigurableInterface,
    ShapeBaseAttributes,
    CuboidInterface
} from "./interfaces";
import {Shape} from "./shapes";

export namespace appContainers {
    export abstract class base extends Shape implements ConfigurableInterface {
        // Satisfy Configurable-Interface
        public setDefaults: (defaults: AttributeContainer) => void;
        public setOptions: (options: AttributeContainer) => void;
        public setOption: (key: string, value: any) => void;
        public getOption: (key: string) => any;
        public getOptions: () => AttributeContainer;
        public requireOption: (key: string) => void;

        public readonly size: number;
        public readonly shapes: Array<Shape>;
        public readonly displayDimensions: CuboidInterface;

        public constructor(key: string);
        public abstract finalize(): void;
        public add(shape: Shape): void;
        public getSpatialInformation(): Array<ShapeBaseAttributes>;
        public draw(parentPosition: Point, parentRotation: number): void;
    }

    export class grid extends UniversalContainer {
        constructor(key: string, mirror?: boolean);
        public finalize(): void;
    }

    export class lightmap extends UniversalContainer {
        constructor(key: string, mirror?: boolean);
        public finalize(): void;
    }

    export class line extends UniversalContainer {
        constructor(key: string, mirror?: boolean);
        public finalize(): void;
    }

    export class platform extends UniversalContainer {
        constructor(key: string, mirror?: boolean);
        public finalize(): void;
    }

    export class row extends UniversalContainer {
        constructor(key: string, mirror?: boolean);
        public finalize(): void;
    }
}

import Container = appContainers.base;
import Grid = appContainers.grid;
import Lightmap = appContainers.lightmap;
import Line = appContainers.line;
import Platform = appContainers.platform;
import Row = appContainers.row;

declare abstract class UniversalContainer extends Container {
    public constructor(key: string, mirror?: boolean);
    public readonly isMirrored: boolean;
}

declare abstract class SpecificContainer extends Container {
    constructor(key: string, options?: AttributeContainer);
}

export {
    UniversalContainer,
    SpecificContainer,
    Container,
    Grid,
    Lightmap,
    Line,
    Platform,
    Row
}

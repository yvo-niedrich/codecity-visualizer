/* tslint:disable */

import {Cuboid, Point} from "./components";
import {AttributeContainer, ConfigurableInterface, ShapeBaseAttributes} from "./interfaces";
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

        public constructor(key: string);
        public abstract finalize(): void;
        get size(): number;
        get shapes(): Array<Shape>;
        public add(shape: Shape): void;
        public getSpatialInformation(): Array<ShapeBaseAttributes>;
        public draw(parentPosition: Point, parentRotation: number): void;
        get displayDimensions(): Cuboid;
    }

    export class grid extends UniversalContainer {
        constructor(key: string, mirror: boolean = false);
        public finalize();
    }

    export class lightmap extends UniversalContainer {
        constructor(key: string, mirror: boolean = false);
        public finalize();
    }

    export class line extends UniversalContainer {
        constructor(key: string, mirror: boolean = false);
        public finalize();
    }

    export class platform extends UniversalContainer {
        constructor(key: string, mirror: boolean = false);
        public finalize();
    }

    export class row extends UniversalContainer {
        constructor(key: string, mirror: boolean = false);
        public finalize();
    }
}

import Container = appContainers.base;
import Grid = appContainers.grid;
import Lightmap = appContainers.lightmap;
import Line = appContainers.line;
import Platform = appContainers.platform;
import Row = appContainers.row;

abstract class UniversalContainer extends Container {
    public constructor(key: string, mirror: boolean = false);
    get isMirrored(): boolean;
}

abstract class SpecificContainer extends Container {
    constructor(key: string, options: AttributeContainer = {});
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

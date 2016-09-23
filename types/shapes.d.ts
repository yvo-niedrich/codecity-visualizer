/* tslint:disable */
import {Cuboid, Point} from "./components";
import {ShapeAttributes, ShapeBaseAttributes} from "./interfaces";


export namespace appShapes {
    export abstract class base {
        protected _key: string;
        protected _hasBeenDrawn: boolean;
        protected _absolutePosition: Point;
        protected _absoluteRotation: number;

        public constructor(key: string);
        get key(): string;
        set margin(margin: number);
        get margin(): number;
        get position(): Point;
        get dimensions(): Cuboid;
        get displayDimensions(): Cuboid;
        get centroid (): Point;
        get rotation(): number;
        public toString(): string;
        public rotate (degrees: number);
        public draw(parentPosition: Point, parentRotation: number);
        public getSpatialInformation(): Array<ShapeBaseAttributes>;
        public updateAttributes(attributes: ShapeAttributes);
        public getAttribute(key: string): any;
    }

    export class house extends Shape {
        constructor(key: string);
    }

    export class platform extends Shape {
        constructor(key: string);
    }

    export class street extends Shape {
        constructor(key: string);
    }
}

import Shape = appShapes.base;
import House = appShapes.house;
import Platform = appShapes.platform;
import Street = appShapes.street;

export {
    Shape,
    House,
    Platform,
    Street
};

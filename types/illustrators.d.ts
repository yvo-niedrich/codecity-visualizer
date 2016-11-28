/* tslint:disable */
import {Version, TreeNode} from "./components";
import {ConfigurableInterface, AttributeContainer, DistrictOptions, StreetContainerOptions} from "./interfaces";
import {Model} from "./models";
import {Rule} from "./rules";

export namespace appIllustrators {
    export abstract class base implements ConfigurableInterface {
        // Satisfy Configurable-Interface
        public setDefaults: (defaults: AttributeContainer) => void;
        public setOptions: (options: AttributeContainer) => void;
        public setOption: (key: string, value: any) => void;
        public getOption: (key: string) => any;
        public getOptions: () => AttributeContainer;
        public requireOption: (key: string) => void;

        public constructor();

        /**
         * Create the 2D spatial model, using the available information
         * for the chosen version.
         * Returns a list of SpatialNodes, which can be rendered in
         */
        public abstract draw(version: Version): any;

        /**
         * Add a Metric-Rule, which will create or alter the attributes
         * of the Shapes and respectively the SpatialNodes.
         * @param {function} rule
         */
        public addRule(rule: Rule): void;

        /**
         * Applies all available rules against a single node and returns an Object
         * covering the changes and additions to the node"s attributes
         */
        protected applyRules(model: Model, node: TreeNode, version: Version): AttributeContainer;
    }

    export class district extends base {
        public setOptions: (options: AttributeContainer) => void;
        public setOption: (key: string, value: any) => void;
        public getOption: (key: string) => any;
        public getOptions: () => AttributeContainer;

        public constructor(model: Model, options: DistrictOptions);
        public draw(version: Version): any;
    }

    export class evostreet extends base {
        public setOptions: (options: AttributeContainer) => void;
        public setOption: (key: string, value: any) => void;
        public getOption: (key: string) => any;
        public getOptions: () => AttributeContainer;

        public constructor(model: Model, options?: StreetContainerOptions);
        public draw(version: Version): any;
    }
}

import Illustrator = appIllustrators.base;
import District = appIllustrators.district;
import Evostreet = appIllustrators.evostreet;

export {
    District,
    Evostreet,
    Illustrator
}

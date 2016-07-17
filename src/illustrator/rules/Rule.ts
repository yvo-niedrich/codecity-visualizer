/* eslint no-unused-vars: "off" */

import {TreeNode} from '../../components/TreeNode';
import {Version} from '../../components/Version';
import {Model} from '../../model/Model';
import {Configurable} from '../components/Mixins';

export type RuleCondition = (model: Model, node: TreeNode, version: Version) => boolean;
export type RuleReadMetric = (model: Model, node: TreeNode, version: Version) => any;
export type RuleMetricApply = (value: any) => any;
export type RuleConstructor = {
    condition?: RuleCondition,
    metric?: RuleReadMetric,
    applyRule?: RuleMetricApply,
    attributes: string
}

/**
 * Rules will be executed for every node, before it is drawn and finalized. Rules describe and set the attributes,
 * reflected in the SpatialNode. It may define new properties, the renderer can take advantage of.
 */
abstract class Rule extends Configurable {

    public static createTraits(attributes, value) {
        let result = {};

        const attr = Array.isArray(attributes) ? attributes : [attributes];
        for (const key of attr) {
            result[String(key)] = value;
        }

        return result;
    }

    constructor(options: RuleConstructor) {
        super();
        this.setOptions(options);
    }

    public abstract condition(model: Model, node: TreeNode, version: Version): boolean;
    public abstract execute(model: Model, node: TreeNode, version: Version): { [index: string]: any };
}

export { Rule as Rule };
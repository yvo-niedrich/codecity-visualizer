import {Configurable} from "../components/Mixins";

export type RuleCondition = (model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface) => boolean;
export type RuleReadMetric = (model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface) => any;
export interface RuleConstructor {
    condition?: RuleCondition;
    metric?: RuleReadMetric;
    attributes: string;
}

 export const ruleDefaults: Object = {
    condition: () => true,
    metric: () => 0
};

/**
 * Rules will be executed for every node, before it is drawn and finalized. Rules describe and set the attributes,
 * reflected in the SpatialNode. It may define new properties, the renderer can take advantage of.
 */
abstract class Rule extends Configurable {

    public static createTraits(attributes: string[] | string, value: any): AttributeContainer {
        let result: AttributeContainer = {};

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

    public abstract condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
    public abstract execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
}

export { Rule as Rule };
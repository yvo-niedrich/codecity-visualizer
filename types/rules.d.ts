/* tslint:disable */
import {AttributeContainer, Configurable, SoftwareModel, TreeNodeInterface, VersionInterface} from "./interfaces"

type RuleCondition = (model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface) => boolean;
type RuleReadMetric = (model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface) => any;
interface RuleConstructor {
    condition?: RuleCondition;
    metric?: RuleReadMetric;
    attributes: string;
}

interface UniversalRuleConstructor extends RuleConstructor {
    applyRule?: (value: any) => any;
}

interface LinearRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    initial?: number;
    factor?: number;
}

interface ExponentialRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    baseScale?: number;
    power?: number;
    factor?: number;
}

interface LogarithmicRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    logexp?: number;
    logbase?: number;
    factor?: number;
}

interface AssignedRuleConstructor extends RuleConstructor {
    salt?: number;
    shift?: number;
}

interface GradientRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    minColor?: number;
    maxColor?: number;
}

export namespace appRules {
    export abstract class base extends Configurable {
        public static createTraits(attributes: Array<string> | string, value: any): AttributeContainer;
        public constructor(options: RuleConstructor);
        public abstract condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
        public abstract execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
    }

    export class universal extends base {
        public constructor(options: UniversalRuleConstructor);
        public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
        public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
    }

    export namespace math {
        export class linear extends base {
            public constructor(options: LinearRuleConstructor);
            public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
            public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
        }

        export class logarithmic extends base {
            public constructor(options: LogarithmicRuleConstructor);
            public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
            public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
        }

        export class exponential extends base {
            public constructor(options: ExponentialRuleConstructor);
            public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
            public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
        }
    }

    export namespace color {
        export class gradient extends base {
            public constructor(options: GradientRuleConstructor);
            public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
            public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
        }

        export class assigned extends base {
            public constructor(options: AssignedRuleConstructor);
            public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean;
            public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer;
        }
    }
}

import Rule = appRules.base;
import UniversalRule = appRules.universal;
import LinearRule = appRules.math.linear;
import LogarithmicRule = appRules.math.logarithmic;
import ExponentialRule = appRules.math.exponential;
import GradientRule = appRules.color.gradient;
import AssignedRule = appRules.color.assigned;

export {
    Rule,
    UniversalRule,
    LinearRule,
    LogarithmicRule,
    ExponentialRule,
    GradientRule,
    AssignedRule
};

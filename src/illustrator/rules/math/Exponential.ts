import {TreeNode} from "../../../components/TreeNode";
import {Version} from "../../../components/Version";
import {Model} from "../../../model/Model";
import {Rule, RuleConstructor, ruleDefaults} from "../Rule";

interface ExponentialRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    baseScale?: number;
    power?: number;
    factor?: number;
}

export class ExponentialRule extends Rule {
    constructor(options: ExponentialRuleConstructor) {
        super(options);
        this.setDefaults(Object.assign(
            {
                "min": 0,
                "max": Infinity,
                "baseScale" : 1,
                "power" : 2,
                "factor": 1
            },
            ruleDefaults
        ));

        this.requireOption("metric");
        this.requireOption("attributes");
    }

    public condition(model: Model, node: TreeNode, version: Version): boolean {
        return this.getOption("condition")(model, node, version);
    }

    public execute(model: Model, node: TreeNode, version: Version): { [index: string]: any } {
        const nodeValue = this.getOption("metric")(model, node, version);
        const newValue = this.expFunction(parseInt(nodeValue, 10));
        return Rule.createTraits(this.getOption("attributes"), newValue);
    }

    private expFunction(value: number): number {
        const result = Math.pow(
                this.getOption("baseScale") * value,
                this.getOption("power")
            ) * this.getOption("factor");

        return Math.max(Math.min(result, this.getOption("max")), this.getOption("min"));
    }
}
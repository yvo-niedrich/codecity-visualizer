import {Rule, RuleConstructor, ruleDefaults} from "../Rule";

interface LogarithmicRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    logexp?: number;
    logbase?: number;
    factor?: number;
}

export class LogarithmicRule extends Rule {
    constructor(options: LogarithmicRuleConstructor) {
        super(options);
        this.setDefaults(Object.assign(
            {
                min: 0,
                max: Infinity,
                logexp: 1,
                logbase: 2,
                factor: 1
            },
            ruleDefaults
        ));

        this.requireOption("metric");
        this.requireOption("attributes");
    }

    public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean {
        return this.getOption("condition")(model, node, version);
    }

    public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): { [index: string]: any } {
        const nodeValue = this.getOption("metric")(model, node, version);
        const newValue = this.logarithmicFunction(parseInt(nodeValue, 10));
        return Rule.createTraits(this.getOption("attributes"), newValue);
    }

    private logarithmicFunction(value: number): number {
        const result = Math.pow(
            Math.log(value + 1) / Math.log(this.getOption("logbase")),
            this.getOption("logexp")
        ) * this.getOption("factor");

        return Math.max(Math.min(result, this.getOption("max")), this.getOption("min"));
    }
}

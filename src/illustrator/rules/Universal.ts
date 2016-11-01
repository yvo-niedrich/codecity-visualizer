import {Rule, RuleConstructor, ruleDefaults} from "./Rule";

interface UniversalRuleConstructor extends RuleConstructor {
    applyRule?: (value: any) => any;
}

export class UniversalRule extends Rule {
    constructor(options: UniversalRuleConstructor) {
        super(options);
        this.setDefaults(Object.assign(
            {
                applyRule: (val: any) => val
            },
            ruleDefaults
        ));

        this.requireOption("attributes");
    }

    public condition(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): boolean {
        return this.getOption("condition")(model, node, version);
    }

    public execute(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer {
        const nodeValue = this.getOption("metric")(model, node, version);
        const newValue = this.getOption("applyRule")(nodeValue);
        return Rule.createTraits(this.getOption("attributes"), newValue);
    }
}

import {Rule, RuleConstructor, ruleDefaults} from "../Rule";

interface AssignedRuleConstructor extends RuleConstructor {
    salt?: number;
    shift?: number;
}

export class AssignedRule extends Rule {
    constructor(options: AssignedRuleConstructor) {
        super(options);
        this.setDefaults(Object.assign(
            {
                salt: 6717153,
                shift: 23
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
        const newValue = this.calculateColor(String(nodeValue));
        return Rule.createTraits(this.getOption("attributes"), newValue);
    }

    private calculateColor(value: string): number {
        let hash = this.getOption("salt");
        for (let i = 0; i < value.length; i++) {
            hash = value.charCodeAt(i) + ((hash >> this.getOption("shift")) - hash);
            hash *= value.charCodeAt(value.length - i - 1);
            hash &= 0xFFFFFF;
        }
        return hash;
    }
}

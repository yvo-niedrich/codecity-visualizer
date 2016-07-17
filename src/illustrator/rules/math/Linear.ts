import {TreeNode} from '../../../components/TreeNode';
import {Version} from '../../../components/Version';
import {Model} from '../../../model/Model';
import {Rule, RuleConstructor, ruleDefaults} from '../Rule';

interface LinearRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    initial?: number;
    factor?: number;
}

export class LinearRule extends Rule {
    constructor(options: LinearRuleConstructor) {
        super(options);
        this.setDefaults(Object.assign(
            {
                'min': 0,
                'max': Infinity,
                'initial' : 0,
                'factor': 1
            },
            ruleDefaults
        ));

        this.requireOption('metric');
        this.requireOption('attributes');
    }

    public condition(model: Model, node: TreeNode, version: Version): boolean {
        return this.getOption('condition')(model, node, version);
    }

    public execute(model: Model, node: TreeNode, version: Version): { [index: string]: any } {
        const nodeValue = this.getOption('metric')(model, node, version);
        const newValue = this.linearFunction(parseInt(nodeValue, 10));
        return Rule.createTraits(this.getOption('attributes'), newValue);
    }

    /**
     * @param {number} value
     * @returns {number}
     * @private
     */
    private linearFunction(value: number): number {
        const result = (this.getOption('initial ') + value) * this.getOption('factor');
        return Math.max(Math.min(result, this.getOption('max')), this.getOption('min'));
    }
}
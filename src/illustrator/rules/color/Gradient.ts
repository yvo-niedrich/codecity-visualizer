import {Rule, RuleConstructor, ruleDefaults} from "../Rule";

interface ColorContainer {
    r: number;
    g: number;
    b: number;
}

interface GradientRuleConstructor extends RuleConstructor {
    min?: number;
    max?: number;
    minColor?: number;
    maxColor?: number;
}

export class GradientRule extends Rule {
    constructor(options: GradientRuleConstructor) {
        super(options);
        this.setDefaults(Object.assign(
            {
                min: 0,
                max: 100,
                minColor: 0xFFFFFF,
                maxColor: 0xFF0000
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
        const newValue = this.calculateColor(nodeValue);
        return Rule.createTraits(this.getOption("attributes"), newValue);
    }

    /**
     * @param {number} value
     * @returns {number} color
     * @private
     */
    private calculateColor(value: number): number {
        const startColor = this.hex2rgb(this.getOption("minColor"));
        const endColor = this.hex2rgb(this.getOption("maxColor"));
        const steps = this.getOption("max") - this.getOption("min");
        let normalized = Math.min(
                Math.max(this.getOption("min"), value),
                this.getOption("max")
            ) - this.getOption("min");
        const percent = Math.min(Math.max(normalized / steps, 0), 1);
        const valueColor = {
            r: startColor.r + ((endColor.r - startColor.r) * percent),
            g: startColor.g + ((endColor.g - startColor.g) * percent),
            b: startColor.b + ((endColor.b - startColor.b) * percent)
        };

        return this.rgb2hex(valueColor);
    }

    private hex2rgb(color: number): ColorContainer {
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        return { r, g, b };
    }

    private rgb2hex(color: ColorContainer): number {
        return (color.r << 16) + (color.g << 8) + color.b;
    }
}

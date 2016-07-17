var BaseRule = require('./../Rule').Rule;

class GradientRule extends BaseRule {
    constructor(options) {
        super(options);

        /* eslint-disable no-unused-vars */
        this.setOptions(options);
        this.setDefaults({
            'condition': function(model, node, version) { return true; },
            'metric': function(model, node, version) { return 0; },
            'min': 0,
            'max': 100,
            'minColor': 0xFFFFFF,
            'maxColor': 0xFF0000
        });
        /* eslint-enable no-unused-vars */

        this.requireOption('metric');
        this.requireOption('attributes');
    }

    /**
     * @param {BaseSoftwareModel} model
     * @param {TreeNode}  node
     * @param {Version}   version
     * @returns {boolean}
     */
    condition(model, node, version) {
        return this.getOption('condition')(model, node, version);
    }

    /**
     * @param {BaseSoftwareModel} model
     * @param {TreeNode}  node
     * @param {Version}   version
     * @returns {Object}
     */
    execute(model, node, version) {
        var nodeValue = this.getOption('metric')(model, node, version);
        var newValue = this._calculateColor(nodeValue);
        return BaseRule.createTraits(this.getOption('attributes'), newValue);
    }

    /**
     * @param {number} value
     * @returns {number} color
     * @private
     */
    _calculateColor(value) {
        const startColor = this._hex2rgb(this.getOption('minColor'));
        const endColor = this._hex2rgb(this.getOption('maxColor'));
        const steps = this.getOption('max') - this.getOption('min');
        const valueWithinSteps = Math.min(Math.max(this.getOption('min'), value), this.getOption('max')) - this.getOption('min');
        const percent = Math.min(Math.max(valueWithinSteps / steps, 0), 1);
        const valueColor = [
            startColor[0] + ((endColor[0] - startColor[0]) * percent),
            startColor[1] + ((endColor[1] - startColor[1]) * percent),
            startColor[2] + ((endColor[2] - startColor[2]) * percent)
        ];

        return this._rgb2hex(valueColor);
    }

    /**
     * @param {number} color
     * @returns {Array}
     * @private
     */
    _hex2rgb(color) {
        var r = (color >> 16) & 255;
        var g = (color >> 8) & 255;
        var b = color & 255;
        return [r, g, b];
    }

    /**
     * @param {Array} color
     * @returns {number}
     * @private
     */
    _rgb2hex(color) {
        return (color[0] << 16) + (color[1] << 8) + color[2];
    }
}

module.exports = GradientRule;
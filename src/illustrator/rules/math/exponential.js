var BaseRule = require('./../base.js');

class ExponentialRule extends BaseRule {
    constructor(options) {
        super(options);

        /* eslint-disable no-unused-vars */
        this.setOptions(options);
        this.setDefaults({
            'condition': function(model, node, version) { return true; },
            'metric': function(model, node, version) { return 0; },
            'min': 0,
            'max': Infinity,
            'baseScale' : 1,
            'power' : 2,
            'factor': 1
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
        var newValue = this._expFunction(nodeValue);
        return BaseRule.createTraits(this.getOption('attributes'), newValue);
    }

    /**
     * @param {number} value
     * @returns {number}
     * @private
     */
    _expFunction(value) {
        var result = Math.pow(
                this.getOption('baseScale') * value,
                this.getOption('power')
            ) * this.getOption('factor');

        return Math.max(Math.min(result, this.getOption('max')), this.getOption('min'));
    }
}

module.exports = ExponentialRule;
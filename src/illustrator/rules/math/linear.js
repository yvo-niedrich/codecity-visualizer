var BaseRule = require('./../base.js');

class LinearRule extends BaseRule {
    constructor(options) {
        super(options);

        /* eslint-disable no-unused-vars */
        this.setOptions(options);
        this.setDefaults({
            'condition': function(model, node, version) { return true; },
            'metric': function(model, node, version) { return 0; },
            'min': 0,
            'max': Infinity,
            'initial': 0,
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
     */
    execute(model, node, version) {
        var nodeValue = this.getOption('metric')(model, node, version);
        var newValue = this._linearFunction(nodeValue);
        return BaseRule.createTraits(this.getOption('attribute'), newValue);
    }

    /**
     * @param {number} value
     * @returns {number}
     * @private
     */
    _linearFunction(value) {
        var result = (this.getOption('initial ')+ value) * this.getOption('factor');

        return Math.max(Math.min(result, this.getOption('max')), this.getOption('min'));
    }
}

module.exports = LinearRule;
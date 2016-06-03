var BaseRule = require('./../base.js');
var Helper = require('../../../model/helper/attributeExtractor.js');

class LinearRule extends BaseRule {
    constructor(options) {
        super(options);

        /* eslint-disable no-unused-vars */
        this.setOptions(options);
        this.setDefaults({
            'condition': function(model, node, version) { return true; },
            'min': 0,
            'max': Infinity,
            'initial': 0,
            'factor': 1,
            'method': Helper.attrFallbackFirstAvailablePredecessor,
            'fallback': 0
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
        var nodeValue = parseInt(this._extractAttribute(model, node, version));
        var newValue = this._linearFunction(nodeValue);
        return BaseRule.createTraits(this.getOption('attribute'), newValue);
    }

    /**
     * @param model
     * @param node
     * @param version
     * @returns {*}
     * @private
     */
    _extractAttribute(model, node, version) {
        try {
            var attributes = this.getOption('method')(model, node, version);
            var metric = String(this.getOption('metric'));
            if (attributes && metric in attributes) {
                return attributes[metric];
            }

            return this.getOption('fallback');
        } catch (err) {
            return this.getOption('fallback');
        }
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
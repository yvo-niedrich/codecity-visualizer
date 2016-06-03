var BaseRule = require('./../base.js');
var Helper = require('../../../model/helper/attributeExtractor.js');

class LogarithmicRule extends BaseRule {
    constructor(options) {
        super(options);

        /* eslint-disable no-unused-vars */
        this.setOptions(options);
        this.setDefaults({
            'condition': function(model, node, version) { return true; },
            'min': 0,
            'max': Infinity,
            'logexp' : 1,
            'logbase' : 2,
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
     * @returns {Object}
     */
    execute(model, node, version) {
        var nodeValue = this._extractAttribute(model, node, version);
        var newValue = this._logarithmicFunction(parseInt(nodeValue));
        return BaseRule.createTraits(this.getOption('attributes'), newValue);
    }

    /**
     * @param {BaseSoftwareModel} model
     * @param {TreeNode}  node
     * @param {Version}   version
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
    _logarithmicFunction(value) {
        var result = Math.pow(
            Math.log(value + 1) / Math.log(this.getOption('logbase')),
            this.getOption('logexp')
        ) * this.getOption('factor');

        return Math.max(Math.min(result, this.getOption('max')), this.getOption('min'));
    }
}

module.exports = LogarithmicRule;
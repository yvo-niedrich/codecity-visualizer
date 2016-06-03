var BaseRule = require('./base.js');

class UniversalRule extends BaseRule {
    constructor(options) {
        super(options);

        /* eslint-disable no-unused-vars */
        this.setOptions(options);
        this.setDefaults({
            'condition': function(model, node, version) { return true; },
            'metric': function(model, node, version) { return 0; },
            'applyRule': function(metricValue) { return metricValue; }
        });
        /* eslint-enable no-unused-vars */

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
        var newValue = this.getOption('applyRule')(nodeValue);
        return BaseRule.createTraits(this.getOption('attribute'), newValue);
    }
}

module.exports = UniversalRule;
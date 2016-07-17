var BaseRule = require('./../Rule').Rule;

class AssignedRule extends BaseRule {
    constructor(options) {
        super(options);

        /* eslint-disable no-unused-vars */
        this.setOptions(options);
        this.setDefaults({
            'condition': function(model, node, version) { return true; },
            'metric': function(model, node, version) { return 0; },
            'salt': 6717153,
            'shift': 23
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
        var newValue = this._calculateColor(String(nodeValue));
        return BaseRule.createTraits(this.getOption('attributes'), newValue);
    }

    /**
     * @param {String} value
     * @returns {number}
     * @private
     */
    _calculateColor(value) {
        var hash = this.getOption('salt');
        for (let i = 0; i < value.length; i++) {
            hash = value.charCodeAt(i) + ((hash >> this.getOption('shift')) - hash);
            hash *= value.charCodeAt(value.length - i - 1);
            hash &= 0xFFFFFF;
        }
        return hash;
    }
}

module.exports = AssignedRule;
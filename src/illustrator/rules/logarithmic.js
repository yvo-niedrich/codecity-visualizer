var BaseRule = require('./base.js');
var Helper = require('../../model/helper/attributeExtractor.js');

class LogarithmicRule extends BaseRule {
    constructor(options) {
        super(options);

        this.setOptions(options);
        this.setDefaults({
            'min': 0,
            'max': Infinity,
            'logexp' : 1,
            'logsbase' : 2,
            'factor': 1,
            'method': Helper.attrFallbackFirstAvailablePredecessor,
            'fallback': 0
        });

        this.requireOption('metric');
        this.requireOption('attributes');
    }

    /**
     * @abstract
     * @param {TreeNode}  node
     * @param {Version}   version
     * @param {BaseModel} model
     */
    execute(node, version, model) {
        var nodeValue = parseInt(this._extractAttribute(node, version, model));
        var newValue = this._logarithmicFunction(nodeValue);
        return this._exportValue(newValue);
    }

    /**
     * @param node
     * @param version
     * @param model
     * @returns {*}
     * @private
     */
    _extractAttribute(node, version, model) {
        try {
            var attributes = this.getOption('method')(node, version, model);
            var metric = this.getOption('metric');
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
        return Math.pow(
            Math.log(value + 1) / Math.log(this.getOption('logsbase')),
            this.getOption('logexp')
        ) * this.getOption('factor');
    }

    /**
     * @param newValue
     * @returns {Object}
     * @private
     */
    _exportValue(newValue) {
        var result = {};

        var attributes = this.getOption('attributes');
        if (!Array.isArray(attributes)) {
            attributes = [attributes];
        }

        for (let key of attributes) {
            result[String(key)] = newValue;
        }

        return result;
    }
}

module.exports = LogarithmicRule;
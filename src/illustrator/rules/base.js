/* eslint no-unused-vars: "off" */

var ConfigurableInterface = require('../interfaces/configurable.js');

/**
 * TODO
 * @implements Configurable
 */
class BaseRule {
    /**
     * @param  {Object}   options
     * @return {BaseRule}
     */
    constructor(options) {}

    /**
     * @abstract
     * @param {BaseSoftwareModel} model
     * @param {TreeNode}  node
     * @param {Version}   version
     * @returns {boolean}
     */
    condition(model, node, version) {}

    /**
     * @abstract
     * @param {BaseSoftwareModel} model
     * @param {TreeNode}  node
     * @param {Version}   version
     * @returns {Object}
     */
    execute(model, node, version) {}

    /**
     * @param attributes
     * @param value
     * @returns {Object}
     */
    static createTraits(attributes, value) {
        var result = {};

        var attr = Array.isArray(attributes) ? attributes : [attributes];
        for (const key of attr) {
            result[String(key)] = value;
        }

        return result;
    }
}

module.exports = ConfigurableInterface(BaseRule);

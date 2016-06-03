/* eslint no-unused-vars: "off" */

var ConfigurableInterface = require('../interfaces/configurable.js');

/**
 * Rules will be executed for every node, before it is drawn and finalized. Rules describe and set the attributes,
 * reflected in the SpatialNode. It may define new properties, the renderer can take advantage of.
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

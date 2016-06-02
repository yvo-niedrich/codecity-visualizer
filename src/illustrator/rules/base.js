/* eslint no-unused-vars: "off" */

var ConfigurableInterface = require('../interfaces/configurable.js');

/**
 * TODO
 */
class BaseRule {
    /**
     * @param  {Object}   options
     * @return {BaseRule}
     */
    constructor(options) {}

    /**
     * @abstract
     * @param {TreeNode}  node
     * @param {Version}   version
     * @param {BaseModel} model
     */
    execute(node, version, model) {}
}

module.exports = ConfigurableInterface(BaseRule);

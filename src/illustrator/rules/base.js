/* eslint no-unused-vars: "off" */

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
     *
     * @param {TreeNode}  node
     * @param {Version}   version
     * @param {BaseModel} model
     */
    execute(node, version, model) {}
}

module.exports = BaseRule;

/* eslint no-unused-vars: "off" */

var ConfigurableInterface = require('./interfaces/configurable.js');
var BaseRule = require('./rules/base.js');

/**
 * Converts the model into a 2D SoftwareCity consisting of SpatialNodes.
 *
 * @implements Configurable
 */
class BaseIllustrator {
    /**
     * @param  {BaseSoftwareModel} model
     * @param  {Object}            options
     * @return {BaseIllustrator}
     */
    constructor(model, options) {
        this._rules = [];
    }

    /**
     * Create the 2D spatial model, using the available information
     * for the chosen version.
     * Returns a list of SpatialNodes, which can be rendered in
     * combination with the model.
     * @abstract
     * @param  {Version} version
     * @return {Illustration}
     */
    draw(version) {}

    /**
     * Add a Metric-Rule, which will create or alter the attributes
     * of the Shapes and respectively the SpatialNodes.
     * @param {function} rule
     */
    addRule(rule) {
        this._rules.push(rule);
    }

    /**
     * Applies all available rules against a single node and returns an Object
     * covering the changes and additions to the node's attributes
     * @param {TreeNode}           node
     * @param {BaseSoftwareModel}  model
     * @param {Version}            version
     * @return {Object}
     * @protected
     */
    applyRules(node, model, version) {
        var attributes = {};
        for (const rule of this._rules) {

            let ruleAttr;
            if (rule instanceof BaseRule) {
                if (!rule.condition(model, node, version)) {
                    continue;
                }
                ruleAttr = rule.execute(model, node, version);
            } else {
                // TODO: backwards compatible! (Finish & remove)
                ruleAttr = rule(node, version, model)
            }

            Object.assign(attributes, ruleAttr);
        }

        return attributes;
    }
}

module.exports = ConfigurableInterface(BaseIllustrator);

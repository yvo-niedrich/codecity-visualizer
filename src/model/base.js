/* eslint no-unused-vars: "off" */

/**
 * This is what a SoftwareModel has to look like
 */
class BaseSoftwareModel {
    constructor() {}

    /**
     * Get the Models Graph. A List of Objects, connecting `source` and `target`.
     * @abstract
     * @return {Array<Dependency>}
     */
    get graph() {}

    /**
     * Get the Root-Node of the tree.
     * @abstract
     * @return {TreeNode}
     */
    get tree() {}

    /**
     * Get an ordered List of all versions.
     * @abstract
     * @return {Array<Version>}
     */
    get versions() {}

    /**
     * Existence Function
     * @abstract
     * @param  {TreeNode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {boolean}
     */
    exists(node, version) {}

    /**
     * Property function
     * @abstract
     * @param  {TreeNode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {null|Object}
     */
    attributes(node, version) {}
}

module.exports = BaseSoftwareModel;
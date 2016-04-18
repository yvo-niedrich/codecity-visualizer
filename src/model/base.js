/**
 * This is what a SoftwareModel has to look like
 * 
 * @interface
 */
class BaseSoftwareModel {
    constructor() {
        if (new.target === BaseSoftwareModel) {
            throw new TypeError("Cannot construct instances of this class directly");
        }
    }

    /**
     * Get the Models Graph. A List of Objects, connecting `source` and `target`.
     * @return {object}
     */
    get graph() {};

    /**
     * Get the Root-Node of the tree.
     * @return {function} <components/TreeNode>
     */
    get tree() {};

    /**
     * Get the List of versions. Every version has a `key` and a `label`.
     * @return {array}
     */
    get versions() {};

    /**
     * Existence Function
     * @param  {string} node    Node-Key
     * @param  {string} version Version-Key
     * @return {boolean}
     */
    exists(node, version) {};

    /**
     * Property function
     * @param  {string} node    Node-Key
     * @param  {string} version Version-key
     * @return {null|object}
     */
    attributes(node, version) {};
}

module.exports = BaseSoftwareModel;
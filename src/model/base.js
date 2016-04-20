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
     * @return {components/TreeNode}
     */
    get tree() {};

    /**
     * Get the List of versions.
     * @return {array<components/Version>}
     */
    get versions() {};

    /**
     * Existence Function
     * @param  {Treenode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {boolean}
     */
    exists(node, version) {};

    /**
     * Property function
     * @param  {Treenode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {null|object}
     */
    attributes(node, version) {};
}

module.exports = BaseSoftwareModel;
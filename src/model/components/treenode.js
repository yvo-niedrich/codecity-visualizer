/**
 * A Classic
 */
class TreeNode {
    /**
     * Create a new TreeNode
     * @param  {String}   key Identifier for this node
     * @return {TreeNode}     Get a fresh TreeNode-Object
     */
    constructor(key) {
        this._key      = key;
        this._children = [];
        this._parent   = null;
    }

    /**
     * Convert Node to String (it's key)
     * @return {String}
     */
    toString() {
        return String(this._key);
    }

    /**
     * Add a new Child to this node
     * @param  {string|TreeNode} child Give a key (string) or an already configured node
     * @return {TreeNode}        returns the newly created child
     */
    add(child) {
        if (!(child instanceof TreeNode)) {
            child = new TreeNode(child);
        }

        child.parent = this;
        this._children.push(child);

        return child;
    }

    /**
     * Find recursively finds the node. If it is not part of the tree, return false [depth-first search]
     * @param  {string} key Item to find
     * @return {boolean|TreeNode}
     */
    find(key) {
        if (this._key == key) {
            return this;
        }

        for (var child of this._children) {
            var result = child.find(key);
            if (result) {
                return result;
            }
        }

        return false;
    }

    /**
     * Get All children
     * @return {Array}
     */
    get children() {
        return this._children;
    }

    /**
     * Get this node's parent. Returns null, if none is available 
     * @return {TreeNode}
     */
    get parent() {
        return this._parent;
    }

    /**
     * Set this node's parent
     * @param  {TreeNode} node
     */
    set parent(node) {
        this._parent = node;
    }
}

module.exports = TreeNode;

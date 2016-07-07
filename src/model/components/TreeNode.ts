class TreeNode {
    // TODO: TypeScript 2.0 -> or null!
    public parent: TreeNode;

    // TODO: TypeScript 2.0 -> readonly!
    public children: Array<TreeNode>;
    private key: String;

    constructor(key: String) {
        this.key      = key;
        this.children = [];
        this.parent   = null;
    }

    /**
     * Convert Node to String (it's key)
     * @return {String}
     */
    public toString(): String {
        return this.key;
    }

    /**
     * Add a new Child to this node
     * @param  {string|TreeNode} child Give a key (string) or an already configured node
     * @return {TreeNode}        returns the newly created child
     */
    public add(child): TreeNode {
        if (!(child instanceof TreeNode)) {
            child = new TreeNode(child);
        }

        child.parent = this;
        this.children.push(child);

        return child;
    }

    /**
     * Find recursively finds the node. If it is not part of the tree, return false [depth-first search]
     * @param  {string} key Item to find
     * @return {boolean|TreeNode}
     */
    public find(key: TreeNode|String): TreeNode|boolean {
        if (this.toString() === key.toString()) {
            return this;
        }

        for (const child of this.children) {
            const result = child.find(key);
            if (result) {
                return result;
            }
        }

        return false;
    }
}

export default TreeNode;
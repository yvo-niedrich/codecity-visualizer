export class TreeNode implements TreeNodeInterface {
    public parent: TreeNode | null;
    public readonly children: Array<TreeNode>;
    private key: string;

    constructor(key: string) {
        this.key      = key;
        this.children = [];
        this.parent   = null;
    }

    /**
     * Convert Node to String (it"s key)
     * @return {String}
     */
    public toString(): string {
        return this.key;
    }

    /**
     * Add a new Child to this node
     * @param  {string|TreeNode} child Give a key (string) or an already configured node
     * @return {TreeNode}        returns the newly created child
     */
    public add(child: string | TreeNode): TreeNode {
        let myChild: TreeNode;

        if (typeof child === "string") {
            myChild = new TreeNode(child);
        } else {
            myChild = child;
        }

        myChild.parent = this;
        this.children.push(myChild);

        return myChild;
    }

    /**
     * Find recursively finds the node. If it is not part of the tree, return false [depth-first search]
     * @param  {string} key Item to find
     * @return {TreeNode}
     */
    public find(key: TreeNode|string): TreeNode | null {
        if (this.toString() === key.toString()) {
            return this;
        }

        for (const child of this.children) {
            const result = child.find(key);
            if (result) {
                return result;
            }
        }

        return null;
    }
}

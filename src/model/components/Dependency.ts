import TreeNode from "./TreeNode";

/**
 * A Software Dependency
 */
class Dependency {
    // TODO: TypeScript 2.0 -> readonly
    public source: TreeNode;
    public target: TreeNode;

    constructor(source: TreeNode, target: TreeNode) {
        this.source = source;
        this.target = target;
    }

    /**
     * Convert Dependency to String
     * @return {string}
     */
    public toString(): string {
        return this.source + " -> + " + this.target;
    }
}

export default Dependency;
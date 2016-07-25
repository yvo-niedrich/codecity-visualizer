import {TreeNode} from "./TreeNode";

/**
 * A Software Dependency
 */
export class Dependency {
    public readonly source: TreeNode;
    public readonly target: TreeNode;

    constructor(source: TreeNode, target: TreeNode) {
        this.source = source;
        this.target = target;
    }

    public toString(): string {
        return this.source + " -> + " + this.target;
    }
}

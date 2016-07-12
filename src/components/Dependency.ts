import TreeNode from "./TreeNode";

/**
 * A Software Dependency
 */
class Dependency {
    // TODO: TypeScript 2.0 -> readonly
    private _source: TreeNode;
    private _target: TreeNode;

    constructor(source: TreeNode, target: TreeNode) {
        this._source = source;
        this._target = target;
    }

    public toString(): string {
        return this._source + " -> + " + this._target;
    }
}

export default Dependency;

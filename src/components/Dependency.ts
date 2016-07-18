import {TreeNode} from './TreeNode';

/**
 * A Software Dependency
 */
export class Dependency {
    // TODO: TypeScript 2.0 -> readonly
    private _source: TreeNode;
    private _target: TreeNode;

    constructor(source: TreeNode, target: TreeNode) {
        this._source = source;
        this._target = target;
    }

    get source(): TreeNode {
        return this._source;
    }

    get target(): TreeNode {
        return this._target;
    }

    public toString(): string {
        return this._source + ' -> + ' + this._target;
    }
}

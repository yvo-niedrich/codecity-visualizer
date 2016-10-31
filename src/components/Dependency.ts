export class Dependency implements DependencyInterface {
    public readonly source: TreeNodeInterface;
    public readonly target: TreeNodeInterface;

    constructor(source: TreeNodeInterface, target: TreeNodeInterface) {
        this.source = source;
        this.target = target;
    }

    public toString(): string {
        return this.source + " -> + " + this.target;
    }
}

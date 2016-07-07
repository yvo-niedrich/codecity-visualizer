import Dependency from "./components/Dependency";
import TreeNode from "./components/TreeNode";
import Version from "./components/Version";

interface ISoftwareModel {
    /** Get the Models Graph. A List of Objects, connecting `source` and `target`. */
    graph: Array<Dependency>;

    /** Get the Root-Node of the tree. */
    tree: TreeNode;

    /** Get an ordered List of all versions. */
    versions: Array<Version>;

    /** Existence Function */
    exists(node: TreeNode, version: Version): boolean;

    /** Property function */
    attributes(node: TreeNode, version: Version);
}

export default ISoftwareModel;
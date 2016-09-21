/* tslint:disable */
export namespace appComponents {
    export class cuboid {
        public length: number;
        public width: number;
        public height: number;
        public readonly diagonal;
        public readonly base;
        constructor(length?: number, width?: number, height?: number);
    }

    export class dependency {
        public readonly source: TreeNode;
        public readonly target: TreeNode;
        constructor(source: TreeNode, target: TreeNode)
    }

    export class point {
        public y: number;
        public x: number;
        public z: number;
        constructor(x?: number, y?: number, z?: number);
    }

    export class node {
        public parent: TreeNode | null;
        public readonly children: Array<TreeNode>;
        constructor(key: string);
        public add(child: string | TreeNode): TreeNode;
        public find(key: TreeNode|string): TreeNode | null;
    }

    export class version {
        public readonly key: string;
        public readonly label: string;
        constructor(key: string, label: string, order?: number);
    }
}

import Cuboid = appComponents.cuboid;
import Dependency = appComponents.dependency;
import Point = appComponents.point;
import TreeNode = appComponents.node;
import Version = appComponents.version;

export {
    Cuboid,
    Dependency,
    Point,
    TreeNode,
    Version
}

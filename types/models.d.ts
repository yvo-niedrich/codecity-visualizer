/* tslint:disable */
import {Dependency, TreeNode, Version} from "./components";

export interface SoftwareModel {
    getGraph(): Array<Dependency>;
    getTree(): TreeNode;
    getVersions(): Array<Version>;
    exists(node: TreeNode, version: Version): Boolean;
    getAttributes(node: TreeNode, version: Version): {[index: string]: any};
}

export namespace appModels {
    export abstract class base implements SoftwareModel {
        public abstract getGraph(): Array<Dependency>;
        public abstract getTree(): TreeNode;
        public abstract getVersions(): Array<Version>;
        public abstract exists(node: TreeNode, version: Version): boolean;
        public abstract getAttributes(node: TreeNode, version: Version): {[index: string]: any};
    }

    export class dummy extends Model {
        public getGraph(): Array<Dependency>;
        public getTree(): TreeNode;
        public getVersions(): Array<Version>;
        public exists(node: TreeNode, version: Version): boolean;
        public getAttributes(node: TreeNode, version: Version): {[index: string]: any};
    }
}

import Model = appModels.base;
import Dummy = appModels.dummy;

export {
    Model,
    Dummy
}

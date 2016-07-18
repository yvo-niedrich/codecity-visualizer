"use strict";

var CCV = require('../../../app');
var BaseSoftwareModel = CCV.models.base;
var TreeNode = CCV.components.node;
var Version = CCV.components.version;

class JasmineRuleModel extends BaseSoftwareModel {
    constructor() {
        super();
        this._tree = new TreeNode('root');
        this._tree.add(new TreeNode('child'));
        this._version = new Version('k1', 'v1');
        this._attr = {
            'root': {
                'test.value1': 0,
                'test.value2': 1,
                'test.value3': 21,
                'test.value4': 'root'
            },
            'child' : {
                'test.value1': 100,
                'test.value2': 50,
                'test.value3': 6,
                'test.value4': 'child'
            }
        }
    }

    /**
     * Get the Models Graph. A List of Objects, connecting `source` and `target`.
     * @return {Array<Dependency>}
     */
    get graph() {
        return [];
    }

    /**
     * Get the Root-Node of the tree.
     * @return {TreeNode}
     */
    get tree() {
        return this._tree;
    }

    /**
     * Get an ordered List of all versions.
     * @return {Array<Version>}
     */
    get versions() {
        return [this._version];
    }

    /**
     * Existence Function
     * @return {boolean}
     */
    exists() {
        return true;
    }

    /**
     * Property function
     * @return {Object}
     */
    attributes(node) {
        return this._attr[String(node)];
    }
}

module.exports = JasmineRuleModel;

var BaseModel = require("./base.js");
var TreeNode  = require("./components/treenode.js");

/**
 * DummyModel returning animals
 *
 * @implements BaseSoftwareModel
 */
class DummyModel extends BaseModel {
    constructor(options) {
        super();
        
        /* Step 1: Create Tree */
        var tree = new TreeNode('animals');
        tree.add('mammals');
        tree.find('mammals').add('fennecfox');
        tree.find('mammals').add('armadillo');
        tree.find('mammals').add('monkeys');
        tree.find('monkeys').add('chimp');
        tree.find('monkeys').add('marmoset');
        tree.add('reptiles');
        tree.find('reptiles').add('gecko');
        tree.find('reptiles').add('tortoise');
        this._tree = tree;

        /* Step 2: Create Graph */
        this._graph = [
            { source: 'marmoset', target: 'tortoise'}
            // Because the marmoset likes to ride on a tortoise
        ]

        /* Step 3: Create versions */
        this._versions = [
            { key: 'alpha', label: 'Two Weeks before Opening'},
            { key: 'v1.0',  label: 'Opening Day'}
        ]
    }

    /**
     * Get all observed animal interactions
     * @return {object}
     */
    get graph() {
        return this._graph;
    };

    /**
     * Get all the Animals in the Zoo
     * @return {function} <components/TreeNode>
     */
    get tree() {
        return this._tree;
    };

    /**
     * Get the Zoo Snapshots
     * @return {array}
     */
    get versions() {
        return this._versions;
    };

    /**
     * Existence Function
     * @param  {string} node    Node-Key
     * @param  {string} version Version-Key
     * @return {boolean}
     */
    exists(node, version) {
        // Since Reptiles were acquired later, they are first available on opening day
        if (version == 'alpha') {
            return this._tree.find('mammals').find(node) ? true :false;
        }

        return true;
    };

    /**
     * Property function
     * @param  {string} node    Node-Key
     * @param  {string} version Version-key
     * @return {null|object}
     */
    attributes(node, version) {
        // @TODO
        throw 'not yet implemented';
    };
}

module.exports = DummyModel;

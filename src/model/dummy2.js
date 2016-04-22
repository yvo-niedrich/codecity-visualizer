var BaseModel  = require("./base.js");
var TreeNode   = require("./components/treenode.js");
var Version    = require("./components/version.js");
var Dependency = require("./components/dependency.js");

/**
 * ZooModel returning animals
 *
 * @implements BaseSoftwareModel
 */
class ZooModel extends BaseModel {
    constructor() {
        super();
        
        /* Step 1: Create Tree */
        var tree = new TreeNode('zoo');
        tree.add('mammals');
        tree.find('mammals').add('fennecfox');
        tree.find('mammals').add('armadillo');
        tree.find('mammals').add('bengaltiger');
        tree.find('mammals').add('marmoset');
        tree.find('mammals').add('chimp');
        tree.find('mammals').add('squirrelmonkey');
        tree.find('mammals').add('macaque');
        tree.find('mammals').add('orangutan');
        tree.find('mammals').add('gorilla');
        tree.find('mammals').add('langur');
        tree.find('mammals').add('baboon');
        tree.find('mammals').add('douc');
        this._tree = tree;

        /* Step 2: Create Graph */
        this._graph = [
            new Dependency('marmoset', 'chimp')
            // Because the marmoset likes to play with chimp
        ]

        /* Step 3: Create versions */
        this._versions = [
            new Version('alpha', 'Two Weeks before Opening'),
            new Version('v1.0',  'Opening Day')
        ]
    };

    /**
     * Get all observed animal interactions
     * @return {object}
     */
    get graph() {
        return this._graph;
    };

    /**
     * Get the Structure of the zoo
     * @return {TreeNode}
     */
    get tree() {
        return this._tree;
    };

    /**
     * Get the observed Zoo Snapshots
     * @return {array}
     */
    get versions() {
        return this._versions;
    };

    /**
     * Existence Function for Animals on Snapshots
     * @param  {string} node    Node
     * @param  {string} version Version
     * @return {boolean}
     */
    exists(node, version) {
        // Since Reptiles were acquired later, they are first available on opening day
        if (String(version) === 'alpha') {
            return this._tree.find('mammals').find(node) ? true :false;
        }

        return true;
    };

    /**
     * Property function
     * @param  {string} node    Node
     * @param  {string} version Version
     * @return {null|object}
     */
    attributes(node, version) {
        // @TODO
        throw 'not yet implemented';
    };
}

module.exports = ZooModel;

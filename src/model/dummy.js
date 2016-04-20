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
        tree.find('mammals').add('monkeys');
        tree.find('monkeys').add('marmoset');
        tree.find('monkeys').add('chimp');
        tree.find('monkeys').add('squirrelmonkey');
        tree.find('monkeys').add('macaque');
        tree.find('monkeys').add('orangutan');
        tree.find('monkeys').add('gorilla');
        tree.find('monkeys').add('langur');
        tree.find('monkeys').add('baboon');
        tree.find('monkeys').add('douc');
        tree.add('reptiles');
        tree.find('reptiles').add('gecko');
        tree.find('reptiles').add('tortoise');
        this._tree = tree;

        /* Step 2: Create Graph */
        this._graph = [
            new Dependency('marmoset', 'tortoise')
            // Because the marmoset likes to ride on a tortoise
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
        if (version == 'alpha') {
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

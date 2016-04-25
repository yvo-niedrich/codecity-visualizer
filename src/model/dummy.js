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
        tree.find('mammals').add('marsupials');
        tree.find('marsupials').add('opossum');
        tree.find('marsupials').add('mole');
        tree.find('marsupials').add('kowari');
        tree.find('marsupials').add('kaluta');
        tree.find('marsupials').add('quoll');
        tree.add('reptiles');
        tree.find('reptiles').add('gecko');
        tree.find('reptiles').add('tortoise');
        this._tree = tree;

        /* Step 2: Create Graph */
        this._graph = [
            new Dependency('marmoset', 'tortoise')
            // Because the marmoset likes to ride on a tortoise
        ];

        /* Step 3: Create versions */
        this._versions = [
            new Version('alpha', 'Two Weeks before Opening'),
            new Version('v1.0',  'Opening Day')
        ];

        /* Step 4: Create Attributes */
        this._attributes = {};
        for (var v of this._versions) {
            this._attributes[String(v)] = {};
            this._createAttributes(this._tree, v);
        }

        console.log(this._attributes);
    };

    _createAttributes(tree, version) {
        if (!tree.children.length) {
            if (this.exists(tree, version)) {
                var t = String(tree);
                var v = String(version);
                this._attributes[v][t] = {
                    'name': t,
                    'loc' : this._hashString('loc' + t + v) % 1502
                }
            }
            return;
        }

        for (var c of tree.children) {
            this._createAttributes(c, version);
        }
    }

    _hashString(str) {
        // https://github.com/darkskyapp/string-hash
        var hash = 17,
            i    = str.length
        while(i) {
            hash = (hash * 11) ^ str.charCodeAt(--i)
        }
        return hash >>> 0;
    }

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
        var n = String(node);
        var v = String(version);

        if (!this._attributes[v]
            || !this._attributes[v][n]) {
            return {};
        }

        return this._attributes[v][n];
    };
}

module.exports = ZooModel;

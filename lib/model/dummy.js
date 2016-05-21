"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseModel = require("./base.js");
var TreeNode = require("./components/treenode.js");
var Version = require("./components/version.js");
var Dependency = require("./components/dependency.js");

/**
 * ZooModel returning animals
 *
 * @implements BaseSoftwareModel
 */

var ZooModel = function (_BaseModel) {
    _inherits(ZooModel, _BaseModel);

    function ZooModel() {
        _classCallCheck(this, ZooModel);

        /* Step 1: Create Tree */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ZooModel).call(this));

        var tree = new TreeNode('zoo');
        tree.add('mammals');
        tree.find('mammals').add('armadillo');
        tree.find('mammals').add('bentaltiger');
        tree.find('mammals').add('zebra');
        tree.find('mammals').add('elephant');
        tree.find('mammals').add('hyena');
        tree.find('mammals').add('monkeys');
        tree.find('monkeys').add('callitrichidae');
        tree.find('callitrichidae').add('marmoset');
        tree.find('callitrichidae').add('tamarin');
        tree.find('monkeys').add('cebidae ');
        tree.find('cebidae ').add('squirrelmonkey');
        tree.find('cebidae ').add('capuchin');
        tree.find('monkeys').add('chimp');
        tree.find('monkeys').add('macaque');
        tree.find('monkeys').add('orangutan');
        tree.find('monkeys').add('gorilla');
        tree.find('monkeys').add('langur');
        tree.find('monkeys').add('baboon');
        tree.find('monkeys').add('douc');
        tree.find('mammals').add('cats');
        tree.find('cats').add('lynx');
        tree.find('cats').add('silvestris');
        tree.find('cats').add('cafra');
        tree.find('cats').add('caucasica');
        tree.find('cats').add('caudata');
        tree.find('cats').add('chutuchta');
        tree.find('cats').add('cretensis');
        tree.find('cats').add('gordoni');
        tree.find('cats').add('grampia');
        tree.find('cats').add('griselda');
        tree.find('cats').add('hausa');
        tree.find('cats').add('jordansi');
        tree.find('cats').add('lybica');
        tree.find('cats').add('nesterovi');
        tree.find('cats').add('ornata');
        tree.find('cats').add('reyi');
        tree.find('cats').add('rubida');
        tree.find('cats').add('tristrami');
        tree.find('cats').add('ugandae');
        tree.find('mammals').add('marsupials');
        tree.find('marsupials').add('opossum');
        tree.find('marsupials').add('mole');
        tree.find('marsupials').add('kowari');
        tree.find('marsupials').add('kaluta');
        tree.find('marsupials').add('quoll');
        tree.find('mammals').add('fox');
        tree.find('fox').add('cerdocyon');
        tree.find('fox').add('otocyon');
        tree.find('fox').add('grayfox');
        tree.find('fox').add('fennecfox');
        tree.find('fox').add('arcticfox');
        tree.find('fox').add('redfox');
        tree.find('mammals').add('marine');
        tree.find('marine').add('dolphin');
        tree.find('marine').add('seal');
        tree.find('marine').add('manatee');
        tree.find('marine').add('sealion');
        tree.find('marine').add('otter');
        tree.add('reptiles');
        tree.find('reptiles').add('gecko');
        tree.find('reptiles').add('tortoise');
        _this._tree = tree;

        /* Step 2: Create Graph */
        _this._graph = [new Dependency('marmoset', 'tortoise')
        // Because the marmoset likes to ride on a tortoise
        ];

        /* Step 3: Create versions */
        _this._versions = [new Version('alpha', 'Two Weeks before Opening', 1462060800), new Version('v1.0', 'Opening Day', 1463216400)];
        _this._versions.sort(function (a, b) {
            return a - b;
        }); // Ensure order

        /* Step 4: Create Attributes */
        _this._attributes = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _this._versions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;

                _this._attributes[String(v)] = {};
                _this._createAttributes(_this._tree, v);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return _this;
    }

    _createClass(ZooModel, [{
        key: "_createAttributes",
        value: function _createAttributes(tree, version) {
            if (!tree.children.length) {
                if (this.exists(tree, version)) {
                    var t = String(tree);
                    var v = String(version);
                    this._attributes[v][t] = {
                        'name': t,
                        'loc': this._hashString('loc' + t + v) % 687,
                        'editors': 1 + this._hashString('edit' + t + v) % 14
                    };
                }
                return;
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = tree.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var c = _step2.value;

                    this._createAttributes(c, version);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "_hashString",
        value: function _hashString(str) {
            // https://github.com/darkskyapp/string-hash
            var hash = 17,
                i = str.length;
            while (i) {
                hash = hash * 11 ^ str.charCodeAt(--i);
            }
            return hash >>> 0;
        }

        /**
         * Get all observed animal interactions
         * @return {object}
         */

    }, {
        key: "exists",


        /**
         * Existence Function for Animals on Snapshots
         * @param  {string} node    Node
         * @param  {string} version Version
         * @return {boolean}
         */
        value: function exists(node, version) {
            // In Alpha-Version, some animals were missing
            if (String(version) === 'alpha') {

                // Only Cats, whose name began with 'a-i' were available
                var cats = this._tree.find('cats');
                if (cats && cats.find(node)) {
                    return String(node)[0] <= 'i';
                }

                // Since Reptiles were acquired later, they are first available on opening day
                var mammals = this._tree.find('mammals');
                return mammals && mammals.find(node) ? true : false;
            }

            return true;
        }
    }, {
        key: "attributes",


        /**
         * Property function
         * @param  {string} node    Node
         * @param  {string} version Version
         * @return {null|object}
         */
        value: function attributes(node, version) {
            var n = String(node);
            var v = String(version);

            if (!this._attributes[v] || !this._attributes[v][n]) {
                return {};
            }

            return this._attributes[v][n];
        }
    }, {
        key: "graph",
        get: function get() {
            return this._graph;
        }
    }, {
        key: "tree",


        /**
         * Get the Structure of the zoo
         * @return {TreeNode}
         */
        get: function get() {
            return this._tree;
        }
    }, {
        key: "versions",


        /**
         * Get the observed Zoo Snapshots
         * @return {array}
         */
        get: function get() {
            return this._versions;
        }
    }]);

    return ZooModel;
}(BaseModel);

module.exports = ZooModel;
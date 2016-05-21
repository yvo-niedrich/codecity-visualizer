'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A Classic
 */

var TreeNode = function () {
    /**
     * Create a new TreeNode
     * @param  {string}   key Identifier for this node
     * @return {function}     Get a fresh TreeNode-Object
     */

    function TreeNode(key) {
        _classCallCheck(this, TreeNode);

        this._key = key;
        this._children = [];
        this._parent = null;
    }

    _createClass(TreeNode, [{
        key: 'toString',


        /**
         * Convert Object to String (it's key)
         * @return {string}
         */
        value: function toString() {
            return this._key;
        }
    }, {
        key: 'add',


        /**
         * Add a new Child to this node
         * @param {string|function} child Give a key (string) or an already configured node
         */
        value: function add(child) {
            if (typeof child !== 'function') {
                child = new TreeNode(child);
            }

            child.parent = this;
            this._children.push(child);
        }
    }, {
        key: 'find',


        /**
         * Find recursivly finds the node. If it is not part of the tree, return false [depth-first search]
         * @param  {string} key Item to find
         * @return {boolean|function}
         */
        value: function find(key) {
            if (this._key == key) {
                return this;
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var child = _step.value;

                    var result = child.find(key);
                    if (result) {
                        return result;
                    }
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

            return false;
        }
    }, {
        key: 'children',


        /**
         * Get All children
         * @return {Array}
         */
        get: function get() {
            return this._children;
        }
    }, {
        key: 'parent',


        /**
         * Get this node's parent. Returns null, if none is available 
         * @return {function|null}
         */
        get: function get() {
            return this._parent;
        },


        /**
         * Set this node's parent
         * @param  {function} node
         */
        set: function set(node) {
            this._parent = node;
        }
    }]);

    return TreeNode;
}();

module.exports = TreeNode;
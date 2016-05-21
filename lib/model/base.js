"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This is what a SoftwareModel has to look like
 * 
 * @interface
 */

var BaseSoftwareModel = function () {
  function BaseSoftwareModel() {
    _classCallCheck(this, BaseSoftwareModel);
  }

  _createClass(BaseSoftwareModel, [{
    key: "exists",


    /**
     * Existence Function
     * @param  {Treenode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {boolean}
     */
    value: function exists(node, version) {}
  }, {
    key: "attributes",


    /**
     * Property function
     * @param  {Treenode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {null|object}
     */
    value: function attributes(node, version) {}
  }, {
    key: "graph",


    /**
     * Get the Models Graph. A List of Objects, connecting `source` and `target`.
     * @return {object}
     */
    get: function get() {}
  }, {
    key: "tree",


    /**
     * Get the Root-Node of the tree.
     * @return {TreeNode}
     */
    get: function get() {}
  }, {
    key: "versions",


    /**
     * Get an ordered List of all versions.
     * @return {array<Version>}
     */
    get: function get() {}
  }]);

  return BaseSoftwareModel;
}();

module.exports = BaseSoftwareModel;
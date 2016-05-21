"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Converts the model into a 2D SoftwareCity consisting of SpatialNodes.
 * 
 * @interface
 */

var BaseIllustrator = function () {
  /**
   * @param  {BaseSoftwareModel} model
   * @param  {Object}            options
   * @return {BaseIllustrator}
   */

  function BaseIllustrator(model, options) {
    _classCallCheck(this, BaseIllustrator);
  }

  _createClass(BaseIllustrator, [{
    key: "addRule",


    /**
     * Add a Metric-Rule, which will create or alter the attributes
     * of the SpatialNodes.
     * @param {function} rule
     */
    value: function addRule(rule) {}
  }, {
    key: "draw",


    /**
     * Create the 2D spatial model, using the available information
     * for the chosen version.
     * Returns a list of SpatialNodes, which can be rendered in
     * combination with the model.
     * @param  {Version} version
     * @return {Array}
     */
    value: function draw(version) {}
  }]);

  return BaseIllustrator;
}();

module.exports = BaseIllustrator;
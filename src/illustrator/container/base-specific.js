/* eslint no-unused-vars: "off" */

var BaseContainer = require("./base.js");

/**
 * These containers are use for specific Layout Algorithms.
 * They implement a basic interface for setting and getting options
 */
class SpecificContainer extends BaseContainer {
    constructor(key, options = {}) {
        super(key);
    }
}


module.exports = SpecificContainer;

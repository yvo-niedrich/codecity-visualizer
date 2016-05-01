var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/evostreet.js");
var GridContainer = require("./illustrator/container/grid.js");

console.clear();

/* Step 1: Create the Model
 *  - Get Data from DataSource
 *  - Create a Model with the collected Data
 */
 var model = new SoftwareModel();

/* Step 2: Generate a CodeCity from Model
 * - Decide on Metrics to use
 * - Decide on other stuff (Scaling factor, margins, angles, ...)
 * - Insert model and Options to Illustrator
 */
var options = {
    'highway.color': 0x186f9a,
    'street.color': 0x156289,
    'house.margin': 4,
    'evostreet.options' : {
        'spacer.initial': 20,
        'spacer.conclusive': 0,
        'spacer.branches': 20,
        'house.container': GridContainer,
        'house.distribution': function(s) { return s.displayDimensions.base; }
    }
};

var illustrator = new Illustrator(model, options);
illustrator.addRule(require('./illustrator/rules/loc-to-height.js')());
illustrator.addRule(require('./illustrator/rules/editor-to-width.js')());
illustrator.addRule(require('./illustrator/rules/package-to-color.js')());
var illustration = illustrator.draw('alpha');

/* ################################# *
 * ## Dirty Code for POC ########### *
 * ################################# */

document.body.style.margin = '0px';

require('./demo/legend.js')(document.body, model);

var Renderer = require('./demo/threejs-scene.js');

var renderer = new Renderer(document.body);
renderer.renderIllustration(illustration);

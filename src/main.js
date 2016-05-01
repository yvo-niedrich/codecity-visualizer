var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/evostreet.js");
console.clear();

/* Step 1: Create the Model
 *  - Get Data from DataSource
 *  - Create a Model with the collected Data
 */
 var model = new SoftwareModel();

/* Step 2: Generate a CodeCity from Model
 * - Configure Illustrator Layout (Options)
 * - Decide on Metrics to use (Rules)
 * - Draw a specific Version of the City
 */
var options = {
    'highway.color': 0x186f9a,
    'street.color': 0x156289,
    'house.margin': 4,
    'evostreet.options' : {
        'spacer.initial': 20,
        'spacer.conclusive': 0,
        'spacer.branches': 20,
        'house.container': require("./illustrator/container/grid.js"),
        'house.distribution': function(s) { return s.displayDimensions.base; }
    }
};

var illustrator = new Illustrator(model, options);

illustrator.addRule(require('./illustrator/rules/loc-to-height.js')());
illustrator.addRule(require('./illustrator/rules/editor-to-width.js')());
illustrator.addRule(require('./illustrator/rules/package-to-color.js')());

var illustration = illustrator.draw('alpha');

/* Step 3: Draw the Illustration
 * - Just do it
 */

document.body.style.margin = '0px';
require('./demo/legend.js')(document.body, model);

var renderer = new (require('./demo/threejs-scene.js'))(document.body);
renderer.renderIllustration(illustration);

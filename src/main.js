var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/evostreet.js");
// var Renderer = require("./renderer/3js.js");


/* Step 1: Create the Model
 *  - Get Data from DataSource
 *  - Insert Data and create a Model
 */
var model = new SoftwareModel();

/* Step 2: Generate a CodeCity from Model
 * - Decide on Metrics to use
 * - Decide on other stuff (Scaling factor, margins, angles, ...)
 * - Insert model and Options to Illustrator
 */
// var options = {...}; // eg. Metrics
// var illustrator = new Illustrator(model, options);

/* Step 3: Render the "generic" Illustration
 *  - Insert CodeCity-Illustration (along with other options) in the Renderer
 */
// var renderer = new Renderer(illustrator, "#targetCanvas");
// renderer.render(codeCity);

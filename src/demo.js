var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/evostreet.js");
// var Renderer = require("./renderer/3js.js");

console.clear();

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
var options = {}; // eg. Metrics, scaling, ...
var illustrator = new Illustrator(model, options);
var result = illustrator.draw();

/* Step 3: Render the "generic" Illustration
 *  - Insert CodeCity-Illustration (along with other options) in the Renderer
 */
// var renderer = new Renderer(illustrator, "#targetCanvas");
// renderer.render(codeCity);


var renderWidth  = window.innerWidth;
var renderHeight = window.innerHeight;
var renderWidth  = 1200;
var renderHeight = 600;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, renderWidth/renderHeight, 1, 10000);
camera.position.z = 500;        
var controls = new THREE.OrbitControls( camera );
var renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setSize(renderWidth, renderHeight);
document.getElementById("city").appendChild(renderer.domElement);

for (var res of result) {
    addCube(res);
}


function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();


function addCube (element) {
    var defaults = {
        pos: {x: 0, y: 0},
        size: {length: 50, width: 50},
        color: 0x156289,
        height: 1
    }

    for (var attr in element) { defaults[attr] = element[attr]; }
    var z = Math.floor(defaults.height / 2);

    var geometry = new THREE.BoxGeometry( defaults.size.length, defaults.size.width, defaults.height, 0, 0, 0 );
    var material = new THREE.MeshBasicMaterial( { color: defaults.color } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.setX(defaults.pos.x);  
    cube.position.setY(defaults.pos.y); 
    cube.position.setZ(z); 
    scene.add(cube);
}

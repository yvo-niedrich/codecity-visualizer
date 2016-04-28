var THREE         = require("three");
var OrbitControls = require('three-orbit-controls')(THREE);
var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/evostreet.js");

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
var options = {
    houseLength: function() {
        // Could use the three parameters (node, version, model) to calculate specific values
        return 10 + Math.floor(Math.random() * 6) * 4;
    }
};


var illustrator = new Illustrator(model, options);
illustrator.addRule(require('./illustrator/rules/loc-to-height.js')());
var illustration = illustrator.draw('alpha');

/* ################################# *
 * ## Dirty Code for POC ########### *
 * ################################# */

document.body.style.margin = '3px';
var renderWidth  = 1180;
var renderHeight = 650;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, renderWidth/renderHeight, 1, 10000);
camera.position.z = 300;
var controls = new OrbitControls( camera );
var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.domElement.style.border = '1px solid #555';
renderer.domElement.style.display = 'block';
renderer.domElement.style['margin-left'] = 'auto';
renderer.domElement.style['margin-right'] = 'auto';
renderer.setClearColor( 0xffffff );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(renderWidth, renderHeight);
document.body.appendChild(renderer.domElement);
renderer.gammaInput = true;
renderer.gammaOutput = true;

var light1 = new THREE.PointLight( 0xffffff, 0.1 );
light1.position.set( 200, 200, 300 );
scene.add( light1 );

var light2 = new THREE.PointLight( 0xdddddd, 0.1 );
light2.position.set( -400, -250, 350 );
scene.add( light2 );

for (var shape of illustration.shapes) {
    addShape(shape);
}


function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();


function addShape (element) {
    var defaults = {
        position: {x: 0, y: 0},
        dimensions: {length: 1, width: 1, height: 1},
        color: 0x156289
    }

    for (var attr in element) {
        defaults[attr] = element[attr];
    }
    var z = Math.floor(defaults.dimensions.height / 2);

    var geometry = new THREE.BoxGeometry( defaults.dimensions.length, defaults.dimensions.width, defaults.dimensions.height, 0, 0, 0 );
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: defaults.color,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
    });

    var cube = new THREE.Mesh( geometry, material );
    cube.position.setX(defaults.position.x);  
    cube.position.setY(defaults.position.y); 
    cube.position.setZ(z); 
    scene.add(cube);
}

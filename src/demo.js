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
        return 10 + Math.floor(Math.random() * 6) * 3;
    }
};


var illustrator = new Illustrator(model, options);
var illustration = illustrator.draw('alpha');

/* ################################# *
 * ## Dirty Code for POC ########### *
 * ################################# */

var renderWidth  = 1180;
var renderHeight = 600;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, renderWidth/renderHeight, 1, 10000);
camera.position.z = 350;
var controls = new OrbitControls( camera );
var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor( 0xffffff );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(renderWidth, renderHeight);
// document.getElementById("city").appendChild(renderer.domElement);
document.body.appendChild(renderer.domElement);
renderer.gammaInput = true;
renderer.gammaOutput = true;

var light = new THREE.DirectionalLight( 0x555555, 0.1 );
light.position.x = 200;
light.position.y = 200;
light.position.z = 500;
scene.add( light );

for (var shape of illustration.shapes) {
    addCube(shape);
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

    for (var attr in element) {
        defaults[attr] = element[attr];
    }
    var z = Math.floor(defaults.height / 2);

    var geometry = new THREE.BoxGeometry( defaults.size.length, defaults.size.width, defaults.height, 0, 0, 0 );
    var material = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        emissive: defaults.color,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
    } )

    var cube = new THREE.Mesh( geometry, material );
    cube.position.setX(defaults.pos.x);  
    cube.position.setY(defaults.pos.y); 
    cube.position.setZ(z); 
    scene.add(cube);
}

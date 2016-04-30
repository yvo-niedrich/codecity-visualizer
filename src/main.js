var THREE         = require("three");
var OrbitControls = require('three-orbit-controls')(THREE);
var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/evostreet.js");

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
    'evostreet.options' : {
        'spacer.initial': 20,
        'spacer.conclusive': 0,
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


doLegend(document.body, model);

document.body.style.margin = '3px';
var renderWidth  = 1180;
var renderHeight = 650;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, renderWidth/renderHeight, 1, 10000);
camera.position.set( -50, -100, 550 );

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
light1.position.set( 300, 300, 300 );
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
        position: {x: 0, y: 0, z: 0},
        dimensions: {length: 1, width: 1, height: 1},
        color: 0x000000
    }

    for (var attr in element) {
        defaults[attr] = element[attr];
    }
    var z = defaults.position.z + Math.floor(defaults.dimensions.height / 2);

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


/* ################################# *
 * ## CREATE LEGEND ################ *
 * ################################# */
function doLegend(target, model) {
    var legend = document.createElement('div');
    legend.style['float'] = 'left';
    legend.style['margin'] = '20px 5px';

    function intToRGB(i){
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "00000".substring(0, 6 - c.length) + c;
    }

    function addLegendInfo(legend, tree, depth = 0) {
        if (tree.children.length) {
            var tName = String(tree);
            var color = 0;
            for (var j = 0; j < tName.length; j++) {
               color = tName.charCodeAt(j) + ((color << 5) - color);
            }

            var colorbox = document.createElement('div');
            colorbox.style['float'] = 'left';
            colorbox.style['width'] = '10px';
            colorbox.style['height'] = '10px';
            colorbox.style['margin'] = '5px';
            colorbox.style['border'] = '1px solid rgba(0, 0, 0, .2)';
            colorbox.style['background-color'] = '#' + intToRGB(color);

            var entry = document.createElement('div');
            entry.style['padding'] = '2px';
            entry.style['margin-left'] = (2 + (depth * 12)) + 'px';
            if (depth >= 2) {
                entry.style['border-left'] = '1px solid #888';
            }
            entry.appendChild(colorbox);
            entry.appendChild(document.createTextNode(tName));
            legend.appendChild(entry);

            for (var i in tree.children) {
                addLegendInfo(legend, tree.children[i], depth + 1);
            }
        }
    }
    addLegendInfo(legend, model.tree);
    target.appendChild(legend);
}
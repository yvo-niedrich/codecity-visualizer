"use strict";

var SoftwareModel = require("./model/dummy.js");
var Illustrator = require("./illustrator/evostreet.js");

console.clear();

var model = new SoftwareModel();

document.body.style.margin = '0px';

require('./demo/legend.js')(document.body, model);
var DemoControlls = require('./demo/controlls.js');
var controlls = new DemoControlls(document.body, model.versions, render);

var Renderer = require('./demo/threejs-scene.js');
var renderer = new Renderer(document.body);

function render(options, rules, version) {
    var illustrator = new Illustrator(model, options);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var r = _step.value;

            illustrator.addRule(r);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var illustration = illustrator.draw(version);
    renderer.renderIllustration(illustration);
}

// Initial Render
window.setTimeout(function () {
    document.getElementById('draw').click();
}, 100);
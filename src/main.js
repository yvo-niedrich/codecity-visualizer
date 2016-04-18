var SoftwareModel = require("./model/dummy.js");
var model = new SoftwareModel();

document.write("My Model is: " + model.constructor.name);

function inspectTree(node, model) {
    if (!node.children.length) {
        for(var v of model.versions) {
            if (model.exists(node, v.key)) {
                console.log('Animal ' + node + ' first appeared ' + v.label);
                break;
            }
        }
    }

    for (var c of node.children) {
        inspectTree(c, model);
    }
}

inspectTree(model.tree, model);
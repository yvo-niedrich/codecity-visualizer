var ModelProvider = require("./modelprovider/dummy.js");

var provider = new ModelProvider();
document.write("My ModelProvider is: " + provider.constructor.name);

// var TreeNode = require('./model/treenode.js');
// var t = new TreeNode('node1');
// t.add('node2');
// console.log(t);

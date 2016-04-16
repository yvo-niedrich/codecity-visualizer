var ModelProvider = require("./modelprovider/dummy.js");

var provider = new ModelProvider();
document.write("My ModelProvider is: " + provider.constructor.name);

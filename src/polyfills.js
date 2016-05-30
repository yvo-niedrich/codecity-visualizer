// Required polyfills
// Tested with the following Browsers
// * IE11
// * Chrome 50
// * Firefox 45

var requiredPolyfill = [];

var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
if (isBrowser()) {
    requiredPolyfill.push(function() { require('core-js/fn/set'); });
    requiredPolyfill.push(function() { require('core-js/fn/array/index-of.js'); });
    requiredPolyfill.push(function() { require('core-js/fn/object/get-own-property-descriptor.js'); });
    requiredPolyfill.push(function() { require('core-js/fn/object/get-own-property-descriptors.js'); });
    requiredPolyfill.push(function() { require('core-js/fn/object/get-own-property-names.js'); });
    requiredPolyfill.push(function() { require('core-js/fn/object/get-own-property-symbols.js'); });
}

for (var poly of requiredPolyfill) {
    try {
        poly();
    } catch (err) {
        // Assume you did your best,
        // but you encountered IE
    }
}

// Required polyfills
// Tested with the following Browsers
// * IE11
// * Chrome 50
// * Firefox 45

var requiredPolyfills = [
    function() { require('core-js/fn/set'); },
    function() { require('core-js/fn/array/index-of.js'); },
    function() { require('core-js/fn/object/get-own-property-descriptor.js'); },
    function() { require('core-js/fn/object/get-own-property-descriptors.js'); },
    function() { require('core-js/fn/object/get-own-property-names.js'); },
    function() { require('core-js/fn/object/get-own-property-symbols.js'); }
];

for (var poly of requiredPolyfills) {
    try {
        poly();
    } catch (err) {
        console.log('Could not load polyfill: ' + poly);
        console.log(err);
    }
}

// Required polyfills
// Tested with the following Browsers
// * IE11
// * Chrome 50
// * Firefox 45

var requiredPolyfills = [
    'core-js/fn/set',
    'core-js/fn/array/index-of.js',
    'core-js/fn/object/get-own-property-descriptor.js',
    'core-js/fn/object/get-own-property-descriptors.js',
    'core-js/fn/object/get-own-property-names.js',
    'core-js/fn/object/get-own-property-symbols.js'
];

for (var poly of requiredPolyfills) {
    try {
        require(poly);
    } catch (err) {
        console.log('Could not load polyfill: ' + poly);
        console.log(err);
    }
}

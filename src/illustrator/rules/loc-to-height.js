module.exports = function (options = {}) {
    var defaults = {
        'metric': 'loc',
        'attribute': 'height',
        'min': 10,
        'max': 180,
        'logarithmic': true,
        'logexp' : 2.75,
        'logsbase' : 3,
        'factor': 1
    };

    for (var key in defaults) {
        if (key in options) {
            continue;
        }

        options[key] = defaults[key];
    }

    return function (node, version, model) {
        // Applies only to classes
        if (node.children.length) {
            return;
        }

        var attributes = model.attributes(node, version);
        if (!(options.metric in attributes)) {
            return;
        }

        var loc = attributes[options.metric];

        if (options.logarithmic) {
            loc = Math.pow(Math.log(loc + 1) / Math.log(options.logsbase), options.logexp);
        }

        loc *= options.factor;
        
        var newAttributes = {};
        newAttributes[options.attribute] = Math.min(Math.max(loc, options.min), options.max);
        return newAttributes;
    };
};

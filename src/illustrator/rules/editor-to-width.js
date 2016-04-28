module.exports = function (options = {}) {
    var defaults = {
        'metric': 'editors',
        'min': 10,
        'max': 65,
        'logexp' : 2.75,
        'logsbase' : 2,
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

        var editors = attributes[options.metric];
        editors = Math.pow(Math.log(editors + 1) / Math.log(options.logsbase), options.logexp) + defaults.min;
        editors *= options.factor;
        
        var value = Math.min(Math.max(editors, options.min), options.max);

        var newAttributes = {};
        newAttributes['dimensions.length'] = value;
        newAttributes['dimensions.width']  = value;
        return newAttributes;
    };
};

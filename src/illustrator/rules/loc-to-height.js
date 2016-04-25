rule = function (options = {}) {
    this.options = options;
    var defaults = {
        'metric': 'loc',
        'attribute': 'height',
        'min': 10,
        'max': 10000,
        'logarithmic': true,
        'logscale' : 0.05,
        'factor': 10
    };

    for (var key in defaults) {
        if (key in this.options) {
            continue;
        }

        this.options[key] = defaults[key];
    }

    return function (node, version, model) {
        // Applies only to classes
        if (node.children.length) {
            return;
        }

        var attributes = model.attributes(node, version);
        if (!(this.options.metric in attributes)) {
            return;
        }

        var loc = attributes[this.options.metric];

        if (this.options.logarithmic) {
            loc = Math.log(loc * this.options.logscale);
        }

        loc *= this.options.factor;

        var newAttributes = {};
        newAttributes[this.options.attribute] = Math.min(Math.max(loc, this.options.min), this.options.max);
        return newAttributes;
    };
};

module.exports = rule;

'use strict';

module.exports = function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var defaults = {
        'metric': 'loc',
        'attribute': 'dimensions.height',
        'min': 10,
        'max': 180,
        'logarithmic': true,
        'logexp': 2.75,
        'logsbase': 3,
        'factor': 1,
        'fallback': true
    };

    for (var key in defaults) {
        if (key in options) {
            continue;
        }

        options[key] = defaults[key];
    }

    function getAttributes(node, version, model) {
        if (!options.fallback || model.exists(node, version)) {
            return model.attributes(node, version);
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = model.versions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;

                if (model.exists(node, v)) {
                    return model.attributes(node, v);
                }
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

        return {};
    }

    return function (node, version, model) {
        // Applies only to classes
        if (node.children.length) {
            return;
        }

        var attributes = getAttributes(node, version, model);
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
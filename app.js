require('./lib/polyfills.js');

module.exports = {
    'models': {
        'base' : require("./lib/model/base.js"),
        'dummy' : require("./lib/model/dummy.js")
    },

    'components': {
        'dependency': require("./lib/model/components/Dependency.js"),
        'version':    require("./lib/model/components/Version.js"),
        'node':       require("./lib/model/components/TreeNode.js")
    },

    'illustrators': {
        'base':      require("./lib/illustrator/base.js"),
        'evostreet': require("./lib/illustrator/evostreet.js"),
        'district': require("./lib/illustrator/district.js")
    },

    'containers': {
        'base':     require("./lib/illustrator/container/base-universal.js"),
        'row':      require("./lib/illustrator/container/universal/row.js"),
        'lightmap': require("./lib/illustrator/container/universal/lightmap.js"),
        'grid':     require("./lib/illustrator/container/universal/grid.js")
    },

    'shapes': {
        'base':     require("./lib/illustrator/shapes/base.js"),
        'house':    require("./lib/illustrator/shapes/house.js"),
        'street':   require("./lib/illustrator/shapes/street.js"),
        'platform': require("./lib/illustrator/shapes/platform.js")
    },

    'rules': {
        'base' : require('./lib/illustrator/rules/base.js'),
        'universal': require('./lib/illustrator/rules/universal.js'),

        'math': {
            'linear'     : require('./lib/illustrator/rules/math/linear.js'),
            'logarithmic': require('./lib/illustrator/rules/math/logarithmic.js'),
            'exponential': require('./lib/illustrator/rules/math/exponential.js')
        },
        'color': {
            'gradient'   : require('./lib/illustrator/rules/color/gradient.js'),
            'assigned'   : require('./lib/illustrator/rules/color/assigned.js')
        }
    },

    'helper': {
        'attributes': require('./lib/model/helper/attributeExtractor.js')
    }
};

require('./lib/polyfills');

module.exports = {
    'models': {
        'base' : require("./lib/model/Model").BaseSoftwareModel,
        'dummy' : require("./lib/model/Model").DummyModel
    },

    'components': {
        'dependency': require('./lib/model/Components').Dependency,
        'version':    require('./lib/model/Components').Version,
        'node':       require('./lib/model/Components').TreeNode
    },

    'illustrators': {
        'base':      require("./lib/illustrator/base"),
        'evostreet': require("./lib/illustrator/evostreet"),
        'district': require("./lib/illustrator/district")
    },

    'containers': {
        'base':     require("./lib/illustrator/container/base-universal"),
        'row':      require("./lib/illustrator/container/universal/row"),
        'lightmap': require("./lib/illustrator/container/universal/lightmap"),
        'grid':     require("./lib/illustrator/container/universal/grid")
    },

    'shapes': {
        'base':     require("./lib/illustrator/shapes/base"),
        'house':    require("./lib/illustrator/shapes/house"),
        'street':   require("./lib/illustrator/shapes/street"),
        'platform': require("./lib/illustrator/shapes/platform")
    },

    'rules': {
        'base' : require('./lib/illustrator/rules/base'),
        'universal': require('./lib/illustrator/rules/universal'),

        'math': {
            'linear'     : require('./lib/illustrator/rules/math/linear'),
            'logarithmic': require('./lib/illustrator/rules/math/logarithmic'),
            'exponential': require('./lib/illustrator/rules/math/exponential')
        },
        'color': {
            'gradient'   : require('./lib/illustrator/rules/color/gradient'),
            'assigned'   : require('./lib/illustrator/rules/color/assigned')
        }
    },

    'helper': {
        'attributes': require('./lib/model/helper/attributeExtractor')
    }
};

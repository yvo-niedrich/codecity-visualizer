require('./lib/polyfills.js');

module.exports = {
    'models': {
        'base' : require("./lib/model/base.js"),
        'dummy' : require("./lib/model/dummy.js")
    },

    'components': {
        'dependency': require("./lib/model/components/dependency.js"),
        'version':    require("./lib/model/components/version.js"),
        'node':       require("./lib/model/components/treenode.js")
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
        'math': {
            'linear'     : require('./lib/illustrator/rules/math/linear.js'),
            'logarithmic': require('./lib/illustrator/rules/math/logarithmic.js'),
            'exponential': require('./lib/illustrator/rules/math/exponential.js')
        },
        'color': {
            'gradient'   : require('./lib/illustrator/rules/color/gradient.js'),
            'assigned'   : require('./lib/illustrator/rules/color/assigned.js')
        },

        // TODO: Refactor and remove
        'editor-to-width':             require("./lib/illustrator/rules/old/editor-to-width.js"),
        'lighten-platform-with-level': require("./lib/illustrator/rules/old/lighten-platform-with-level.js"),
        'loc-to-height':               require("./lib/illustrator/rules/old/loc-to-height.js"),
        'opacity-if-not-in-version':   require("./lib/illustrator/rules/old/opacity-if-not-in-version.js"),
        'package-to-color':            require("./lib/illustrator/rules/old/package-to-color.js"),
        'save-first-version':          require("./lib/illustrator/rules/old/save-first-version.js")
    },

    'helper': {
        'attribute-extractor': require('./lib/model/helper/attributeExtractor.js')
    }
};

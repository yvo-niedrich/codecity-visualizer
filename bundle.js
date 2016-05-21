module.exports = {
    'models': {
        'base' : require("./src/model/base.js"),
        'dummy' : require("./src/model/dummy.js")
    },

    'components': {
        'dependency': require("./src/model/components/dependency.js"),
        'version':    require("./src/model/components/version.js"),
        'node':       require("./src/model/components/treenode.js")
    },

    'illustrators': {
        'base':      require("./src/illustrator/base.js"),
        'evostreet': require("./src/illustrator/evostreet.js"),
        'districts': require("./src/illustrator/district.js")
    },

    'containers': {
        'base':     require("./src/illustrator/container/base.js"),
        'row':      require("./src/illustrator/container/row.js"),
        'lightmap': require("./src/illustrator/container/lightmap.js"),
        'grid':     require("./src/illustrator/container/grid.js")
    },

    // TODO: Brauche ich wirklich Shapes???
    'shapes': {
        'base':     require("./src/illustrator/shapes/base.js"),
        'house':    require("./src/illustrator/shapes/house.js"),
        'street':   require("./src/illustrator/shapes/street.js"),
        'platform': require("./src/illustrator/shapes/platform.js")
    },

    // TODO!
    'rules': {
        'editor-to-width':             require("./src/illustrator/rules/editor-to-width.js"),
        'lighten-platform-with-level': require("./src/illustrator/rules/lighten-platform-with-level.js"),
        'loc-to-height':               require("./src/illustrator/rules/loc-to-height.js"),
        'opacity-if-not-in-version':   require("./src/illustrator/rules/opacity-if-not-in-version.js"),
        'package-to-color':            require("./src/illustrator/rules/package-to-color.js"),
        'save-first-version':          require("./src/illustrator/rules/save-first-version.js")
    }
};

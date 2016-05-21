module.exports = {
    'models': {
        'base' : require("./model/base.js"),
        'dummy' : require("./model/dummy.js")
    },

    'components': {
        'dependency': require("./model/components/dependency.js"),
        'version':    require("./model/components/version.js"),
        'node':       require("./model/components/treenode.js")
    },

    'illustrators': {
        'base':      require("./illustrator/base.js"),
        'evostreet': require("./illustrator/evostreet.js"),
        'districts': require("./illustrator/district.js")
    },

    'containers': {
        'base':     require("./illustrator/container/base.js"),
        'row':      require("./illustrator/container/row.js"),
        'lightmap': require("./illustrator/container/lightmap.js"),
        'grid':     require("./illustrator/container/grid.js")
    },

    // TODO: Brauche ich wirklich Shapes???
    'shapes': {
        'base':     require("./illustrator/shapes/base.js"),
        'house':    require("./illustrator/shapes/house.js"),
        'street':   require("./illustrator/shapes/street.js"),
        'platform': require("./illustrator/shapes/platform.js")
    },

    // TODO!
    'rules': {
        'editor-to-width':             require("./illustrator/rules/editor-to-width.js"),
        'lighten-platform-with-level': require("./illustrator/rules/lighten-platform-with-level.js"),
        'loc-to-height':               require("./illustrator/rules/loc-to-height.js"),
        'opacity-if-not-in-version':   require("./illustrator/rules/opacity-if-not-in-version.js"),
        'package-to-color':            require("./illustrator/rules/package-to-color.js"),
        'save-first-version':          require("./illustrator/rules/save-first-version.js")
    }
}

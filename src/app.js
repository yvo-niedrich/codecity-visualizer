exports.models = {
    'base' : require('./model/Model').Model,
    'dummy' : require('./model/Model').DummyModel
};

exports.components = {
    'dependency': require('./components/Dependency').Dependency,
    'version':    require('./components/Version').Version,
    'node':       require('./components/TreeNode').TreeNode,
    'cuboid':     require('./components/Cuboid').Cuboid,
    'point':      require('./components/Point').Point
};

exports.illustrators = {
    'base':      require('./illustrator/base'),
    'evostreet': require('./illustrator/evostreet'),
    'district': require('./illustrator/district')
};

exports.containers = {
    'base':     require('./illustrator/container/base-universal'),
    'row':      require('./illustrator/container/universal/row'),
    'lightmap': require('./illustrator/container/universal/lightmap'),
    'grid':     require('./illustrator/container/universal/grid')
};

exports.shapes = {
    'base':     require('./illustrator/components/Shapes').Shape,
    'house':    require('./illustrator/components/Shapes').House,
    'street':   require('./illustrator/components/Shapes').Street,
    'platform': require('./illustrator/components/Shapes').Platform
};

exports.rules = {
    'base': require('./illustrator/rules/Rule').Rule,
    'universal': require('./illustrator/rules/Universal').UniversalRule,

    'math': {
        'linear': require('./illustrator/rules/math/linear'),
        'logarithmic': require('./illustrator/rules/math/logarithmic'),
        'exponential': require('./illustrator/rules/math/exponential')
    },
    'color': {
        'gradient': require('./illustrator/rules/color/gradient'),
        'assigned': require('./illustrator/rules/color/assigned')
    }
};

exports.helper = {
    'attributes': require('./model/helper/attributeExtractor')
};

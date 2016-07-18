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
    'base':      require('./illustrator/Illustrator').Illustrator,
    'evostreet': require('./illustrator/Evostreet').Evostreet,
    'district': require('./illustrator/District').District
};

exports.containers = {
    'base':     require('./illustrator/container/Container').UniversalContainer,
    'row':      require('./illustrator/container/universal/Row').RowContainer,
    'lightmap': require('./illustrator/container/universal/Lightmap').Lightmap,
    'grid':     require('./illustrator/container/universal/Grid').GridContainer
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
        'linear': require('./illustrator/rules/math/Linear').LinearRule,
        'logarithmic': require('./illustrator/rules/math/Logarithmic').LogarithmicRule,
        'exponential': require('./illustrator/rules/math/Exponential').ExponentialRule
    },
    'color': {
        'gradient': require('./illustrator/rules/color/Gradient').GradientRule,
        'assigned': require('./illustrator/rules/color/Assigned').AssignedRule
    }
};

exports.helper = {
    'attributes': require('./model/helper/attributeExtractor')
};

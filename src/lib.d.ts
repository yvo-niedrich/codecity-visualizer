/* tslint:disable */

import Model = require('./model/Model');
// ------------------------------------------
import Cuboid = require('./components/Cuboid');
import Dependency = require('./components/Dependency');
import Point = require('./components/Point');
import TreeNode = require('./components/TreeNode');
import Version = require('./components/Version');
// ------------------------------------------
import Illustrator = require('./illustrator/Illustrator');
import Evostreet = require('./illustrator/Evostreet');
import District = require('./illustrator/District');
// ------------------------------------------
import UniversalContainer = require('./illustrator/container/Container');
import RowContainer = require('./illustrator/container/universal/Row');
import Lightmap = require('./illustrator/container/universal/Lightmap');
import GridContainer = require('./illustrator/container/universal/Grid');
import PlatformContainer = require('./illustrator/container/universal/Platform');
import LineContainer = require('./illustrator/container/universal/Line');
// ------------------------------------------
import Shape = require('./illustrator/components/Shapes');
import House = require('./illustrator/components/Shapes');
import Street = require('./illustrator/components/Shapes');
import Platform = require('./illustrator/components/Shapes');
// ------------------------------------------
import Rule = require('./illustrator/rules/Rule');
import UniversalRule = require('./illustrator/rules/Universal');
import LinearRule = require('./illustrator/rules/math/Linear');
import LogarithmicRule = require('./illustrator/rules/math/Logarithmic');
import ExponentialRule = require('./illustrator/rules/math/Exponential');
import GradientRule = require('./illustrator/rules/color/Gradient');
import AssignedRule = require('./illustrator/rules/color/Assigned');
// ------------------------------------------
import AttributeExtractor = require('./model/helper/AttributeExtractor');

declare namespace models {
    let base: Model.Model;
    let dummy: Model.DummyModel;
}

declare namespace components {
    let cuboid: Cuboid.Cuboid;
    let dependency: Dependency.Dependency;
    let point: Point.Point;
    let node: TreeNode.TreeNode;
    let version: Version.Version;
}

declare namespace illustrators {
    let base: Illustrator.Illustrator;
    let evostreet: Evostreet.Evostreet;
    let district: District.District;
}

declare namespace containers {
    let base: UniversalContainer.UniversalContainer;
    let row: RowContainer.RowContainer;
    let lightmap: Lightmap.Lightmap;
    let grid: GridContainer.GridContainer;
    let platform: PlatformContainer.PlatformContainer;
    let line: LineContainer.LineContainer;
}

declare namespace shapes {
    let base: Shape.Shape;
    let house: House.House;
    let street: Street.Street;
    let platform: Platform.Platform;
}

declare namespace mathRules {
    let linear: LinearRule.LinearRule;
    let logarithmic: LogarithmicRule.LogarithmicRule;
    let exponential: ExponentialRule.ExponentialRule;
}

declare namespace rules {
    let base: Rule.Rule;
    let universal: UniversalRule.UniversalRule;
    namespace math {
        let linear: LinearRule.LinearRule;
        let logarithmic: LogarithmicRule.LogarithmicRule;
        let exponential: ExponentialRule.ExponentialRule;
    }
    namespace color {
        let gradient: GradientRule.GradientRule;
        let assigned: AssignedRule.AssignedRule;
    }
}

declare namespace helper {
    let attributes: AttributeExtractor.AttributeExtractor;
}

export {
    components,
    containers,
    helper,
    illustrators,
    models,
    shapes,
    rules
};

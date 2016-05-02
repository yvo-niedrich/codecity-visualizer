var MirrorContainer = require("./base-mirror.js");
var Lighttree       = require("./helper/lighttree.js");
var Cuboid          = require("../components/cuboid.js");
var Point           = require("../components/point.js");

/**
 * Rows Elements one after the other
 *
 * @todo seperator-attribut!
 * 
 * @implements MirrorContainer
 * @implements BaseContainer
 * @implements BaseShape
 */
class Lightmap extends MirrorContainer {

    constructor(key, mirror = false) {
        super(key, mirror);
        this._optimalAspectRatio = 1.0;
        this._currentDimensions = null;
    };

    _finalize() {
        super._finalize();
        
        if (!this.size) {
            return;
        }
        this._currentDimensions = new Cuboid();

        var shapes = this.shapes;
        shapes.sort(function(a, b) { return b.displayDimensions.width - a.displayDimensions.width});

        var origin = new Point();
        var worstDimensions = new Cuboid();

        for (var shape of this.shapes) {
            worstDimensions.length += Math.ceil(shape.displayDimensions.length);
            worstDimensions.width  += Math.ceil(shape.displayDimensions.width);
            worstDimensions.height = Math.max(shape.displayDimensions.height, worstDimensions.height);
        }

        var tree = new Lighttree(origin, worstDimensions);

        for (var shape of this.shapes) {
            this._addShapeToTree(shape, tree);
        }


        this._calcualteFinalDimensions();
        this._positionShapes(tree);
    };

    _addShapeToTree(shape, tree) {
        var shapeDimensions = shape.displayDimensions;
        var candidates = [];
        tree.collectCandidates(candidates, shapeDimensions);
        
        // Find the best possible Candidate
        var bestPossibleRatio = Infinity;
        var winner;

        for (var c of candidates) {
            var newLength = Math.max(c.origin.x + shapeDimensions.length, this._currentDimensions.length);
            var newWidth  = Math.max(c.origin.y + shapeDimensions.width,  this._currentDimensions.width);
            var candidatesAspectRatio = Math.max(newLength, newWidth) / Math.min(newLength, newWidth);

            if (candidatesAspectRatio < bestPossibleRatio) {
                bestPossibleRatio = candidatesAspectRatio;
                winner = c;

                if(newLength === this._currentDimensions.length && newWidth === this._currentDimensions.width) {
                    // break;
                }
            }
        }

        // Insert Shape into the candidate and update current dimensions
        winner.insert(shapeDimensions, shape);
        this._currentDimensions.length = Math.max(winner.origin.x + shapeDimensions.length, this._currentDimensions.length);
        this._currentDimensions.width  = Math.max(winner.origin.y + shapeDimensions.width,  this._currentDimensions.width);
        this._currentDimensions.height = Math.max(winner.origin.z + shapeDimensions.height, this._currentDimensions.height);
    };

    _calcualteFinalDimensions() {
        this.dimensions.length = this._currentDimensions.length
        this.dimensions.width  = this._currentDimensions.width
        this.dimensions.height = this._currentDimensions.height
    }

    _positionShapes(tree) {
        var containers = [];
        tree.collectNodesWithContent(containers);

        for(var node of containers) {
            var shape = node.content;

            var relativeYPos = node.origin.y + (shape.displayDimensions.width / 2);
            var containerYCentroid = this.dimensions.width / 2;

            shape.position.x = node.origin.x + (shape.displayDimensions.length - this.dimensions.length) / 2;
            shape.position.y = this.isMirrored ? (containerYCentroid - relativeYPos) : (relativeYPos - containerYCentroid);
        }
    };
};

module.exports = Lightmap;

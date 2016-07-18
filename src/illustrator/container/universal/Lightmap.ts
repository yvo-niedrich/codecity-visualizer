import {Cuboid} from '../../../components/Cuboid';
import {Point} from '../../../components/Point';
import {UniversalContainer} from '../Container';
import {Shape} from '../../components/Shapes';

class LightNode {
    private _origin: Point;
    private _dimensions: Cuboid;
    private _content: any;
    private _children: Array<LightNode>;

    constructor(origin: Point, dimensions: Cuboid) {
        this._origin = origin;
        this._dimensions = dimensions;
        this._content = null;
        this._children = [];
    }

    get origin() {
        return this._origin;
    }

    get dimensions() {
        return this._dimensions;
    }

    get content() {
        return this._content;
    }

    public contentFits(measurements: Cuboid): boolean {
        if (this._content) {
            return false;
        }

        return (this.dimensions.length >= measurements.length && this.dimensions.width >= measurements.width);
    }

    public collectCandidates(collection: Array<LightNode>, measurements: Cuboid): void {
        if (this._children.length) {
            for (const c of this._children) {
                c.collectCandidates(collection, measurements);
            }
        } else if (this.contentFits(measurements)) {
            collection.push(this);
        }
    }

    public collectNodesWithContent(collection: Array<LightNode>): void {
        if (this._children.length) {
            for (const c of this._children) {
                c.collectNodesWithContent(collection);
            }
        } else if (this._content) {
            collection.push(this);
        }
    }

    /**
     * @throws Error
     */
    public insert(measurements: Cuboid, object: any, cutHorizontalFirst: boolean = true): LightNode {
        if (!this.contentFits(measurements)) {
            throw 'Object does not fit!';
        }

        const cutOrder = [
            { 'method' : this.cutIfWidthDoesNotFit.bind(this),  'value' : measurements.width },
            { 'method' : this.cutIfLengthDoesNotFit.bind(this), 'value' : measurements.length }
        ];

        if (!cutHorizontalFirst) {
            cutOrder.reverse();
        }

        // If the object would not fit perfectly, we need to cut the
        // area in up to three new (smaller) areas
        for (const cut of cutOrder) {
            cut.method(cut.value);

            if (this._children.length) {
                return this._children[0].insert(measurements, object, cutHorizontalFirst);
            }
        }

        // Object fits perfectly
        this._content = object;
        return this;
    }

    private cutIfWidthDoesNotFit(width: number): void {
        // The Objects width, does not perfectly fit the available width.
        // Split the plane in two and insert the object into the fitting one
        if (this.dimensions.width > width) {

            const o1 = new Point(
                this.origin.x,
                this.origin.y,
                this.origin.z
            );
            const d1 = new Cuboid(
                this.dimensions.length,
                width,
                this.dimensions.height
            );
            this._children.push(new LightNode(o1, d1));

            const o2 = new Point(
                this.origin.x,
                this.origin.y + width,
                this.origin.z
            );
            const d2 = new Cuboid(
                this.dimensions.length,
                this.dimensions.width - width,
                this.dimensions.height
            );
            this._children.push(new LightNode(o2, d2));
        }
    }

    private cutIfLengthDoesNotFit(length: number): void {
        // The Objects length, does not perfectly fit the available length.
        // Split the plane in two and insert the object into the fitting one
        if (this.dimensions.length > length) {

            const o1 = new Point(
                this.origin.x,
                this.origin.y,
                this.origin.z
            );
            const d1 = new Cuboid(
                length,
                this.dimensions.width,
                this.dimensions.height
            );
            this._children.push(new LightNode(o1, d1));

            const o2 = new Point(
                this.origin.x + length,
                this.origin.y,
                this.origin.z
            );
            const d2 = new Cuboid(
                this.dimensions.length - length,
                this.dimensions.width,
                this.dimensions.height
            );
            this._children.push(new LightNode(o2, d2));
        }
    }
}

/**
 * Rows Elements one after the other
 */
export class Lightmap extends UniversalContainer {
    private _currentDimensions: Cuboid;

    constructor(key: string, mirror: boolean = false) {
        super(key, mirror);

        this.setDefaults({
            'cutHorizontalFirst': true
        });

        this._currentDimensions = new Cuboid();
    }

    public finalize() {
        if (!this.size) {
            return;
        }

        const shapes = this.shapes;

        if (this.getOption('cutHorizontalFirst')) {
            shapes.sort(function(a, b) { return b.displayDimensions.width - a.displayDimensions.width; });
        } else {
            shapes.sort(function(a, b) { return b.displayDimensions.length - a.displayDimensions.length; });
        }

        const origin = new Point();
        const worstDimensions = new Cuboid();

        for (const shape of this.shapes) {
            worstDimensions.length += Math.ceil(shape.displayDimensions.length);
            worstDimensions.width  += Math.ceil(shape.displayDimensions.width);
            worstDimensions.height = Math.max(shape.displayDimensions.height, worstDimensions.height);
        }

        const tree = new LightNode(origin, worstDimensions);

        for (const s of this.shapes) {
            this.addShapeToTree(s, tree);
        }

        this.calculateFinalDimensions();
        this.positionShapes(tree);
    }

    private addShapeToTree(shape: Shape, tree: LightNode): void {
        const shapeDimensions = shape.displayDimensions;
        const candidates: Array<LightNode> = [];

        if (!shapeDimensions.length || !shapeDimensions.width) {
            return;
        }

        tree.collectCandidates(candidates, shapeDimensions);

        if (!candidates.length) {
            throw 'Could not find a single candidate. This should never happen!';
        }

        // Find the best possible Candidate
        //
        // Preserver => If possible preserve the current Dimensions and
        //              choose the candidate, that would be the most perfect fit
        //
        // Expander => If an Expansion is required, prefer the candidate that would result
        //             in the best aspect ratio
        let bestPossibleRatio = Infinity;
        let bestPossibleSpace = Infinity;
        let expander: LightNode = null;
        let preserver: LightNode = null;

        for (const c of candidates) {
            const newLength = Math.max(c.origin.x + shapeDimensions.length, this._currentDimensions.length);
            const newWidth  = Math.max(c.origin.y + shapeDimensions.width,  this._currentDimensions.width);
            const canPreserveDimensions = (newLength === this._currentDimensions.length &&
                                            newWidth === this._currentDimensions.width);

            if (preserver && !canPreserveDimensions) {
                continue;
            }

            if (canPreserveDimensions) {
                const candidateLength = Math.min(c.dimensions.length, this._currentDimensions.length - c.origin.x);
                const candidateWidth  = Math.min(c.dimensions.width, this._currentDimensions.width - c.origin.y);
                const wastedSpace = (candidateWidth * candidateLength) -
                                        (shapeDimensions.length * shapeDimensions.width);

                if (wastedSpace < bestPossibleSpace) {
                    bestPossibleSpace = wastedSpace;
                    preserver = c;
                }

            } else {
                const candidatesAspectRatio = Math.max(newLength, newWidth) / Math.min(newLength, newWidth);

                if (candidatesAspectRatio < bestPossibleRatio) {
                    bestPossibleRatio = candidatesAspectRatio;
                    expander = c;
                }
            }
        }

        const winner: LightNode = preserver ? preserver : expander;

        // Insert Shape into the candidate and update current dimensions
        winner.insert(shapeDimensions, shape, this.getOption('cutHorizontalFirst'));

        this._currentDimensions.length = Math.max(
            winner.origin.x + shapeDimensions.length,
            this._currentDimensions.length
        );
        this._currentDimensions.width  = Math.max(
            winner.origin.y + shapeDimensions.width,
            this._currentDimensions.width
        );
        this._currentDimensions.height = Math.max(
            winner.origin.z + shapeDimensions.height,
            this._currentDimensions.height
        );
    }

    private calculateFinalDimensions(): void {
        this.dimensions.length = this._currentDimensions.length;
        this.dimensions.width  = this._currentDimensions.width;
        this.dimensions.height = this._currentDimensions.height;
    }

    private positionShapes(tree: LightNode): void {
        const containers: Array<LightNode> = [];
        tree.collectNodesWithContent(containers);

        for (const node of containers) {
            const shape = node.content;

            const relativeYPos = node.origin.y + (shape.displayDimensions.width / 2);
            const containerYCentroid = this.dimensions.width / 2;

            shape.position.x = node.origin.x + (shape.displayDimensions.length - this.dimensions.length) / 2;
            shape.position.y = this.isMirrored ?
                (containerYCentroid - relativeYPos) :
                (relativeYPos - containerYCentroid);
        }
    }
}

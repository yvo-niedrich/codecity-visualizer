/* tslint:disable:member-ordering */
import {SpecificContainer, Container, UniversalContainer} from "../Container";
import {RowContainer} from "../universal/Row";
import {Street, Shape, House} from "../../components/Shapes";
import {AttributeContainer} from "../../../components/Interfaces";

interface SegmentContainer {
    segments: Array<string>;
    segmented: { [index: string]: Array<Shape> };
    left: { [index: string]: Container };
    right: { [index: string]: Container };
}

type distributionFunction = (s: Shape) => number;
type distributionString = 'left' | 'right' | 'default';
type distributionMethod = distributionString | distributionFunction;

// TODO: Segmentorder --> NULL | function
interface StreetContainerOptions extends AttributeContainer {
    'spacer.initial'?: number;
    'spacer.branches'?: number;
    'spacer.terranullius'?: number;
    'spacer.conclusive'?: number;

    'house.container'?: UniversalContainer;
    'house.distribution'?: distributionMethod;
    'house.segmentation'?: string;
    'house.segmentorder'?: { (a: any): number };

    'branch.container'?: UniversalContainer;
    'branch.distribution'?: distributionMethod;
    'branch.segmentation'?: string;
    'branch.segmentorder'?: { (a: any): number};
}

/**
 * Create an Evostreet Layout City Container
 */
export class StreetContainer extends SpecificContainer {
    private _leftBranchSpacer: number;
    private _rightBranchSpacer: number;
    private _container: {
        road: Street,
        houses: SegmentContainer,
        branches: SegmentContainer
    };

    constructor(key: string, options: StreetContainerOptions = {}) {
        super(key, options);

        this.setDefaults({
            'spacer.initial': 20,
            'spacer.branches': 15,
            'spacer.terranullius': 20,
            'spacer.conclusive': 0,

            'house.container': RowContainer,
            'house.distribution': 'default',
            'house.segmentation': null,
            'house.segmentorder': null,

            'branch.container': RowContainer,
            'branch.distribution': 'default',
            'branch.segmentation': null,
            'branch.segmentorder': null
        });

        this._leftBranchSpacer = 0;
        this._rightBranchSpacer = 0;

        this._container = {
            road: null,
            houses: {
                segments: [],
                segmented: {},
                left: {},
                right: {}
            },
            branches: {
                segments: [],
                segmented: {},
                left: {},
                right: {}
            }
        };
    }

    public setBranchSpacingLeft(spacing: number): void {
        this._leftBranchSpacer = spacing;
    }

    public setBranchSpacingRight(spacing: number): void {
        this._rightBranchSpacer = spacing;
    }

    public add(shape: Shape) {
        if (shape instanceof StreetContainer) {
            this.addBranch(shape);
        } else if (shape instanceof House) {
            this.addHouse(shape);
        } else if (shape instanceof Street) {
            if (this._container.road !== null) {
                throw 'StreetContainer can only have one road.';
            }
            this._container.road = shape;
        } else {
            throw 'Unknown Shape-Type: ' + shape;
        }
    }

    private addHouse(shape: House) {
        let segment: string;

        if (this.getOption('house.segmentation')) {
            segment = shape.getAttribute(this.getOption('house.segmentation'));
        }

        segment = segment != null ? segment : 'default';
        const segmentIndex = String(segment);

        if (this._container.houses.segments.indexOf(segment) < 0) {
            const houseContainer = this.getOption('house.container');
            this._container.houses.segments.push(segment);
            this._container.houses.segmented[segmentIndex] = [];
            this._container.houses.left[segmentIndex]  = new houseContainer(this.key + '_' + segmentIndex + '_hl');
            this._container.houses.right[segmentIndex] = new houseContainer(this.key + '_' + segmentIndex + '_hr', true);
            this._container.houses.left[segmentIndex].rotate(-90);
            this._container.houses.right[segmentIndex].rotate(-90);
        }

        this._container.houses.segmented[segmentIndex].push(shape);
    }

    private addBranch(shape: StreetContainer): void {
        let segment: string;

        if (this.getOption('branch.segmentation')) {
            segment = shape.getAttribute(this.getOption('branch.segmentation'));
        }

        segment = segment != null ? segment : 'default';
        const segmentIndex = String(segment);

        if (this._container.branches.segments.indexOf(segment) < 0) {
            const branchContainer = this.getOption('branch.container');
            this._container.branches.segments.push(segment);
            this._container.branches.segmented[segmentIndex] = [];
            this._container.branches.left[segmentIndex]  = new branchContainer(this.key + '_' + segmentIndex + '_bl');
            this._container.branches.right[segmentIndex] = new branchContainer(this.key + '_' + segmentIndex + '_br', true);
            this._container.branches.left[segmentIndex].rotate(-90);
            this._container.branches.right[segmentIndex].rotate(-90);
        }

        this._container.branches.segmented[segmentIndex].push(shape);
    }

    public finalize(): void {
        if (this._container.road === null) {
            throw 'StreetContainer requires a primary street';
        }
        const mainRoad = this._container.road;

        this.prepareSegments();
        this.addHousesToStructure();
        this.addBranchesToStructure();
        this.updateDimensions();

        let containersBottom = this.getOption('spacer.initial') - (this.dimensions.width / 2);
        const halfTheRoadLength = (mainRoad.displayDimensions.length / 2);
        const middleOfTheRoad = (this.dimensions.length / 2) - this.getRightBlockLength() - halfTheRoadLength;

        mainRoad.dimensions.width = this.dimensions.width;
        mainRoad.position.x = middleOfTheRoad;
        mainRoad.position.y = 0;
        super.add(this._container.road);

        // Place Branches, Segment by Segment
        for (const bSeg of this._container.branches.segments) {
            const bKey = String(bSeg);
            const leftBranch = this._container.branches.left[bKey];
            const rightBranch = this._container.branches.right[bKey];

            if (leftBranch.size) {
                leftBranch.position.x = middleOfTheRoad - halfTheRoadLength - leftBranch.centroid.x;
                leftBranch.position.y = containersBottom + leftBranch.centroid.y;
                super.add(leftBranch);
            }

            if (rightBranch.size) {
                rightBranch.position.x = middleOfTheRoad + halfTheRoadLength + rightBranch.centroid.x;
                rightBranch.position.y = containersBottom + rightBranch.centroid.y;
                super.add(rightBranch);
            }

            containersBottom += Math.max(leftBranch.displayDimensions.width, rightBranch.displayDimensions.width);
        }

        // Add Terra Nullius (if required)
        if (this._container.branches.segments.length) {
            containersBottom += this.getOption('spacer.terranullius');
        }

        // Place Houses, Segment by Segment
        for (const hSeg of this._container.houses.segments) {
            const hKey = String(hSeg);
            const leftHouse = this._container.houses.left[hKey];
            const rightHouse = this._container.houses.right[hKey];

            if (leftHouse.size) {
                leftHouse.position.x = middleOfTheRoad - halfTheRoadLength - leftHouse.centroid.x;
                leftHouse.position.y = containersBottom + leftHouse.centroid.y;
                super.add(leftHouse);
            }

            if (rightHouse.size) {
                rightHouse.position.x = middleOfTheRoad + halfTheRoadLength + rightHouse.centroid.x;
                rightHouse.position.y = containersBottom + rightHouse.centroid.y;
                super.add(rightHouse);
            }

            containersBottom += Math.max(leftHouse.displayDimensions.width, rightHouse.displayDimensions.width);
        }
    }

    private updateDimensions() {
        this.dimensions.length = this.getContainerLength();
        this.dimensions.width  = this.getContainerWidth() + this.getOption('spacer.conclusive');
    }

    private prepareSegments() {
        const sortNaturally = function(a: any, b: any) { return parseInt(a, 10) - parseInt(b, 10); };

        const houseOrder = typeof this.getOption('house.segmentorder') === 'function'
            ? this.getOption('branch.segmentorder') : sortNaturally;

        const branchOrder = typeof this.getOption('branch.segmentorder') === 'function' ?
            this.getOption('branch.segmentorder') : sortNaturally;

        this._container.houses.segments.sort(houseOrder);
        this._container.branches.segments.sort(branchOrder);
    }

    private addHousesToStructure() {
        for (const segment of this._container.houses.segments) {
            const key = String(segment);

            this.distributeShapes(
                this._container.houses.segmented[key],
                this.getOption('house.distribution'),
                this._container.houses.left[key],
                this._container.houses.right[key]
            );
        }
    }

    private addBranchesToStructure() {
        const branchSpacer: number = this.getOption('spacer.branches');
        let initialLeft = true;
        let initialRight = true;

        const addSpacerLeft = function(s: StreetContainer) {
            if (initialLeft) {
                initialLeft = false;
            } else {
                s.setBranchSpacingLeft(branchSpacer);
            }
        };

        const addSpacerRight = function(s: StreetContainer) {
            if (initialRight) {
                initialRight = false;
            } else {
                s.setBranchSpacingRight(branchSpacer);
            }
        };

        for (const segment of this._container.branches.segments) {
            const key = String(segment);

            this.distributeShapes(
                this._container.branches.segmented[key],
                this.getOption('branch.distribution'),
                this._container.branches.left[key],
                this._container.branches.right[key]
            );

            this._container.branches.left[key].shapes.forEach(addSpacerLeft);
            this._container.branches.right[key].shapes.forEach(addSpacerRight);
        }
    }

    private distributeShapes(shapes: Array<Shape>, method: distributionMethod, left: Container, right: Container) {
        if (typeof method === 'string') {
            if (method === 'left') {
                this.distributeShapesToContainer(shapes, left);
            } else if (method === 'right') {
                this.distributeShapesToContainer(shapes, right);
            } else {
                this.distributeShapesInDefaultOrder(shapes, left, right);
            }
        } else {
            this.distributeShapesEquallyByAttribute(shapes, method, left, right);
        }
    }

    private distributeShapesToContainer(shapes: Array<Shape>, container: Container) {
        for (const s of shapes) {
            container.add(s);
        }
    }

    private distributeShapesInDefaultOrder(shapes: Array<Shape>, left: Container, right: Container) {
        for (let i: number = 0; i < shapes.length; i++) {
            if (shapes.hasOwnProperty(i)) {
                const c = (i % 2) ? left : right;
                c.add(shapes[i]);
            }
        }
        // TODO: Kann weg?
        // for (const key in shapes) {
        //     if (shapes.hasOwnProperty(key)) {
        //         const c = (parseInt(key) % 2) ? left : right;
        //         c.add(shapes[key]);
        //     }
        // }
    }

    private distributeShapesEquallyByAttribute(
        shapes: Array<Shape>,
        attr: distributionFunction,
        left: Container,
        right: Container
    ) {
        shapes.sort(function (a: Shape, b: Shape) { return attr(b) - attr(a); });
        let diff = 0;
        for (const s of shapes) {
            if (diff <= 0) {
                left.add(s);
                diff += attr(s);
            } else {
                right.add(s);
                diff -= attr(s);
            }
        }
    }

    private getContainerWidth() {
        const houseWidth = this.getHousesBlockTotalWidth();
        const branchWidth = this.getBranchesBlockTotalWidth();
        const containerMargin = (branchWidth && houseWidth) ? this.getOption('spacer.terranullius') : 0;
        return houseWidth + branchWidth + this.getOption('spacer.initial') + containerMargin;
    }

    private getHousesBlockTotalWidth() {
        let maxLeftHouses = 0;
        let maxRightHouses = 0;
        let tmp: number;

        for (const l in this._container.houses.left) {
            if (!this._container.houses.left.hasOwnProperty(l)) {
                continue;
            }

            tmp = this._container.houses.left[l].displayDimensions.width;
            if (maxLeftHouses < tmp) {
                maxLeftHouses = tmp;
            }
        }

        for (const r in this._container.houses.right) {
            if (!this._container.houses.right.hasOwnProperty(r)) {
                continue;
            }

            tmp = this._container.houses.right[r].displayDimensions.width;
            if (maxRightHouses < tmp) {
                maxRightHouses = tmp;
            }
        }

        return Math.max(maxLeftHouses, maxRightHouses);
    }

    private getBranchesBlockTotalWidth() {
        let maxLeftBranches = 0;
        let maxRightBranches = 0;
        let tmp: number;

        for (const l in this._container.branches.left) {
            if (!this._container.branches.left.hasOwnProperty(l)) {
                continue;
            }

            tmp = this._container.branches.left[l].displayDimensions.width;
            if (maxLeftBranches < tmp) {
                maxLeftBranches = tmp;
            }
        }

        for (const r in this._container.branches.right) {
            if (!this._container.branches.right.hasOwnProperty(r)) {
                continue;
            }

            tmp = this._container.branches.right[r].displayDimensions.width;
            if (maxRightBranches < tmp) {
                maxRightBranches = tmp;
            }
        }

        return Math.max(maxLeftBranches, maxRightBranches);
    }

    private getContainerLength() {
        let leftLength  = this.getLeftBlockLength();
        let rightLength = this.getRightBlockLength();

        return leftLength + this._container.road.displayDimensions.length + rightLength;
    }

    private getLeftBlockLength() {
        let maxLeftHouses = 0;
        let maxLeftBranches = 0;
        let tmp: number;

        for (const h in this._container.houses.left) {
            if (!this._container.houses.left.hasOwnProperty(h)) {
                continue;
            }

            tmp = this._container.houses.left[h].displayDimensions.length;
            if (maxLeftHouses < tmp) {
                maxLeftHouses = tmp;
            }
        }

        for (const b in this._container.branches.left) {
            if (!this._container.branches.left.hasOwnProperty(b)) {
                continue;
            }

            tmp = this._container.branches.left[b].displayDimensions.length;
            if (maxLeftBranches < tmp) {
                maxLeftBranches = tmp;
            }
        }

        return Math.max(maxLeftHouses, maxLeftBranches) + this._leftBranchSpacer;
    }

    private getRightBlockLength() {
        let maxRightHouses = 0;
        let maxRightBranches = 0;
        let tmp: number;

        for (const h in this._container.houses.right) {
            if (!this._container.houses.right.hasOwnProperty(h)) {
                continue;
            }

            tmp = this._container.houses.right[h].displayDimensions.length;
            if (maxRightHouses < tmp) {
                maxRightHouses = tmp;
            }
        }

        for (const b in this._container.branches.right) {
            if (!this._container.branches.right.hasOwnProperty(b)) {
                continue;
            }

            tmp = this._container.branches.right[b].displayDimensions.length;
            if (maxRightBranches < tmp) {
                maxRightBranches = tmp;
            }
        }

        return Math.max(maxRightHouses, maxRightBranches) + this._rightBranchSpacer;
    }
}

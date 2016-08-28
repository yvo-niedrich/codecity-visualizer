/* tslint:disable:member-ordering */
import {SpecificContainer, Container, UniversalContainer} from "../Container";
import {RowContainer} from "../universal/Row";
import {Street, Shape, House} from "../../components/Shapes";
import {AttributeContainer, ShapeAttributes} from "../../../components/Interfaces";
import {PlatformContainer} from "../universal/Platform";

interface SegmentContainer {
    segments: Array<string>;
    segmented: { [index: string]: Array<Shape> };
    left: { [index: string]: Container };
    right: { [index: string]: Container };
}

type distributionFunction = (s: Shape) => number;
type distributionString = "left" | "right" | "default";
type distributionMethod = distributionString | distributionFunction;

type segmentOrderMethod  = { (a: any): number} | null;

type containerFunction = (s: string, m: boolean) => UniversalContainer;

export interface StreetContainerOptions extends AttributeContainer {
    "spacer.initial"?: number;
    "spacer.branches"?: number;
    "spacer.terranullius"?: number;
    "spacer.conclusive"?: number;

    "house.container"?: containerFunction;
    "house.distribution"?: distributionMethod;
    "house.segmentation"?: string;
    "house.segmentorder"?: segmentOrderMethod;
    "house.platforms"?: null | ShapeAttributes;
    "house.path"?: null | ShapeAttributes;

    "branch.container"?: containerFunction;
    "branch.distribution"?: distributionMethod;
    "branch.segmentation"?: string;
    "branch.segmentorder"?: segmentOrderMethod;
}

/**
 * Create an Evostreet Layout City Container
 */
export class StreetContainer extends SpecificContainer {
    private leftBranchSpacer: number;
    private rightBranchSpacer: number;
    private road: Street | null;
    private houses: SegmentContainer;
    private branches: SegmentContainer;

    constructor(key: string, options: StreetContainerOptions = {}) {
        super(key, options);

        const defaults: StreetContainerOptions = {
            "spacer.initial": 20,
            "spacer.branches": 15,
            "spacer.terranullius": 20,
            "spacer.conclusive": 0,

            "house.container": (s: string, m: boolean) => new RowContainer(s, m),
            "house.distribution": "default",
            "house.segmentation": "",
            "house.segmentorder": null,
            "house.platforms": null,
            "house.path": null,

            "branch.container": (s: string, m: boolean) => new RowContainer(s, m),
            "branch.distribution": "default",
            "branch.segmentation": "",
            "branch.segmentorder": null
        };
        this.setDefaults(defaults);

        this.leftBranchSpacer = 0;
        this.rightBranchSpacer = 0;

        this.road = null;

        this.houses = {
            segments: [],
            segmented: {},
            left: {},
            right: {}
        };

        this.branches = {
            segments: [],
            segmented: {},
            left: {},
            right: {}
        };
    }

    public setBranchSpacingLeft(spacing: number): void {
        this.leftBranchSpacer = spacing;
    }

    public setBranchSpacingRight(spacing: number): void {
        this.rightBranchSpacer = spacing;
    }

    public add(shape: Shape) {
        if (shape instanceof StreetContainer) {
            this.addBranch(shape);
        } else if (shape instanceof House) {
            this.addHouse(shape);
        } else if (shape instanceof Street) {
            if (this.road !== null) {
                throw "StreetContainer can only have one road.";
            }
            this.road = shape;
        } else {
            throw "Unknown Shape-Type: " + shape;
        }
    }

    private addHouse(shape: House) {
        let segment: string | null = null;

        if (this.getOption("house.segmentation")) {
            segment = this.getOption("house.segmentation")(shape);
        }

        segment = segment != null ? segment : "default";
        const segmentIndex = String(segment);

        if (this.houses.segments.indexOf(segment) < 0) {
            const houseContainer: containerFunction = this.getOption("house.container");
            this.houses.segments.push(segment);
            this.houses.segmented[segmentIndex] = [];
            this.houses.left[segmentIndex]  = houseContainer(this.key + "_" + segmentIndex + "_hl", false);
            this.houses.right[segmentIndex] = houseContainer(this.key + "_" + segmentIndex + "_hr", true);
            this.houses.left[segmentIndex].rotate(-90);
            this.houses.right[segmentIndex].rotate(-90);
        }

        this.houses.segmented[segmentIndex].push(shape);
    }

    private addBranch(shape: StreetContainer): void {
        let segment: string | null = null;

        if (this.getOption("branch.segmentation")) {
            segment = this.getOption("branch.segmentation")(shape);
        }

        segment = segment != null ? segment : "default";
        const segmentIndex = String(segment);

        if (this.branches.segments.indexOf(segment) < 0) {
            const branchContainer: containerFunction = this.getOption("branch.container");
            this.branches.segments.push(segment);
            this.branches.segmented[segmentIndex] = [];
            this.branches.left[segmentIndex]  = branchContainer(this.key + "_" + segmentIndex + "_bl", false);
            this.branches.right[segmentIndex] = branchContainer(this.key + "_" + segmentIndex + "_br", true);
            this.branches.left[segmentIndex].rotate(-90);
            this.branches.right[segmentIndex].rotate(-90);
        }

        this.branches.segmented[segmentIndex].push(shape);
    }

    public finalize(): void {
        if (this.road === null) {
            throw "StreetContainer requires a primary street";
        }
        const mainRoad = this.road;

        this.prepareSegments();
        this.addHousesToStructure();
        this.addBranchesToStructure();
        this.putHousesOnPlatforms();
        this.updateDimensions();

        let containersBottom = this.getOption("spacer.initial") - (this.dimensions.width / 2);
        const halfTheRoadLength = (mainRoad.displayDimensions.length / 2);
        const middleOfTheRoad = (this.dimensions.length / 2) - this.getRightBlockLength() - halfTheRoadLength;

        mainRoad.dimensions.width = this.dimensions.width;
        mainRoad.position.x = middleOfTheRoad;
        mainRoad.position.y = 0;
        super.add(this.road);

        // Place Branches, Segment by Segment
        for (const bSeg of this.branches.segments) {
            const bKey = String(bSeg);
            const leftBranch = this.branches.left[bKey];
            const rightBranch = this.branches.right[bKey];

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
        if (this.branches.segments.length) {
            containersBottom += this.getOption("spacer.terranullius");
        }

        // Place Houses, Segment by Segment
        for (const hSeg of this.houses.segments) {
            const hKey = String(hSeg);
            const leftHouses = this.houses.left[hKey];
            const rightHouses = this.houses.right[hKey];

            if (leftHouses.size) {
                leftHouses.position.x = middleOfTheRoad - halfTheRoadLength - leftHouses.centroid.x;
                leftHouses.position.y = containersBottom + leftHouses.centroid.y;
                super.add(leftHouses);
            }

            if (rightHouses.size) {
                rightHouses.position.x = middleOfTheRoad + halfTheRoadLength + rightHouses.centroid.x;
                rightHouses.position.y = containersBottom + rightHouses.centroid.y;
                super.add(rightHouses);
            }

            containersBottom += Math.max(leftHouses.displayDimensions.width, rightHouses.displayDimensions.width);
        }
    }

    private updateDimensions(): void {
        this.dimensions.length = this.getContainerLength();
        this.dimensions.width  = this.getContainerWidth() + this.getOption("spacer.conclusive");
    }

    private putHousesOnPlatforms(): void {
        const platformOptions = this.getOption("house.platforms");
        const pathOptions = this.getOption("house.path");
        if (!platformOptions) {
            return;
        }

        const wrap = (c: Container, mirror: boolean): Container => {
            if (!c.size) {
                return c;
            }

            let hContainer = new PlatformContainer(this.key, mirror);
            hContainer.setOptions(platformOptions);
            hContainer.add(c);

            if (pathOptions) {
                let path = new Street(this.key);
                path.updateAttributes(pathOptions);
                hContainer.add(path);
            }

            return hContainer;
        };

        for (const hSeg of this.houses.segments) {
            const hKey = String(hSeg);
            this.houses.left[hKey] = wrap(this.houses.left[hKey], false);
            this.houses.right[hKey] = wrap(this.houses.right[hKey], true);
        }

        return;
    }

    private prepareSegments(): void {
        const sortNaturally = (a: any, b: any) => { return parseInt(a, 10) - parseInt(b, 10); };

        const houseOrder = typeof this.getOption("house.segmentorder") === "function"
            ? this.getOption("branch.segmentorder") : sortNaturally;

        const branchOrder = typeof this.getOption("branch.segmentorder") === "function" ?
            this.getOption("branch.segmentorder") : sortNaturally;

        this.houses.segments.sort(houseOrder);
        this.branches.segments.sort(branchOrder);
    }

    private addHousesToStructure(): void {
        for (const segment of this.houses.segments) {
            const key = String(segment);

            this.distributeShapes(
                this.houses.segmented[key],
                this.getOption("house.distribution"),
                this.houses.left[key],
                this.houses.right[key]
            );
        }
    }

    private addBranchesToStructure(): void {
        const branchSpacer: number = this.getOption("spacer.branches");
        let initialLeft = true;
        let initialRight = true;

        const addSpacerLeft = (s: StreetContainer): void => {
            if (initialLeft) {
                initialLeft = false;
            } else {
                s.setBranchSpacingLeft(branchSpacer);
            }
        };

        const addSpacerRight = (s: StreetContainer): void => {
            if (initialRight) {
                initialRight = false;
            } else {
                s.setBranchSpacingRight(branchSpacer);
            }
        };

        for (const segment of this.branches.segments) {
            const key = String(segment);

            this.distributeShapes(
                this.branches.segmented[key],
                this.getOption("branch.distribution"),
                this.branches.left[key],
                this.branches.right[key]
            );

            this.branches.left[key].shapes.forEach(addSpacerLeft);
            this.branches.right[key].shapes.forEach(addSpacerRight);
        }
    }

    private distributeShapes(shapes: Array<Shape>, method: distributionMethod, left: Container, right: Container): void {
        if (typeof method === "string") {
            if (method === "left") {
                this.distributeShapesToContainer(shapes, left);
            } else if (method === "right") {
                this.distributeShapesToContainer(shapes, right);
            } else {
                this.distributeShapesInDefaultOrder(shapes, left, right);
            }
        } else {
            this.distributeShapesEquallyByAttribute(shapes, <distributionFunction> method, left, right);
        }
    }

    private distributeShapesToContainer(shapes: Array<Shape>, container: Container): void {
        for (const s of shapes) {
            container.add(s);
        }
    }

    private distributeShapesInDefaultOrder(shapes: Array<Shape>, left: Container, right: Container): void {
        for (let i: number = 0; i < shapes.length; i++) {
            if (shapes.hasOwnProperty(i)) {
                const c = (i % 2) ? left : right;
                c.add(shapes[i]);
            }
        }
    }

    private distributeShapesEquallyByAttribute(
        shapes: Array<Shape>,
        attr: distributionFunction,
        left: Container,
        right: Container
    ): void {
        shapes.sort((a: Shape, b: Shape) => { return attr(b) - attr(a); });
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

    private getContainerWidth(): number {
        const houseWidth = this.getHousesBlockTotalWidth();
        const branchWidth = this.getBranchesBlockTotalWidth();
        const containerMargin = (branchWidth && houseWidth) ? this.getOption("spacer.terranullius") : 0;
        return houseWidth + branchWidth + this.getOption("spacer.initial") + containerMargin;
    }

    private getHousesBlockTotalWidth(): number {
        let maxLeftHouses = 0;
        let maxRightHouses = 0;
        let tmp: number;

        for (const l in this.houses.left) {
            if (!this.houses.left.hasOwnProperty(l)) {
                continue;
            }

            tmp = this.houses.left[l].displayDimensions.width;
            if (maxLeftHouses < tmp) {
                maxLeftHouses = tmp;
            }
        }

        for (const r in this.houses.right) {
            if (!this.houses.right.hasOwnProperty(r)) {
                continue;
            }

            tmp = this.houses.right[r].displayDimensions.width;
            if (maxRightHouses < tmp) {
                maxRightHouses = tmp;
            }
        }

        return Math.max(maxLeftHouses, maxRightHouses);
    }

    private getBranchesBlockTotalWidth(): number {
        let maxLeftBranches = 0;
        let maxRightBranches = 0;
        let tmp: number;

        for (const l in this.branches.left) {
            if (!this.branches.left.hasOwnProperty(l)) {
                continue;
            }

            tmp = this.branches.left[l].displayDimensions.width;
            if (maxLeftBranches < tmp) {
                maxLeftBranches = tmp;
            }
        }

        for (const r in this.branches.right) {
            if (!this.branches.right.hasOwnProperty(r)) {
                continue;
            }

            tmp = this.branches.right[r].displayDimensions.width;
            if (maxRightBranches < tmp) {
                maxRightBranches = tmp;
            }
        }

        return Math.max(maxLeftBranches, maxRightBranches);
    }

    private getContainerLength(): number {
        const leftLength  = this.getLeftBlockLength();
        const rightLength = this.getRightBlockLength();
        const road = this.road as Street;

        return leftLength + road.displayDimensions.length + rightLength;
    }

    private getLeftBlockLength(): number {
        let maxLeftHouses = 0;
        let maxLeftBranches = 0;
        let tmp: number;

        for (const h in this.houses.left) {
            if (!this.houses.left.hasOwnProperty(h)) {
                continue;
            }

            tmp = this.houses.left[h].displayDimensions.length;
            if (maxLeftHouses < tmp) {
                maxLeftHouses = tmp;
            }
        }

        for (const b in this.branches.left) {
            if (!this.branches.left.hasOwnProperty(b)) {
                continue;
            }

            tmp = this.branches.left[b].displayDimensions.length;
            if (maxLeftBranches < tmp) {
                maxLeftBranches = tmp;
            }
        }

        return Math.max(maxLeftHouses, maxLeftBranches) + this.leftBranchSpacer;
    }

    private getRightBlockLength(): number {
        let maxRightHouses = 0;
        let maxRightBranches = 0;
        let tmp: number;

        for (const h in this.houses.right) {
            if (!this.houses.right.hasOwnProperty(h)) {
                continue;
            }

            tmp = this.houses.right[h].displayDimensions.length;
            if (maxRightHouses < tmp) {
                maxRightHouses = tmp;
            }
        }

        for (const b in this.branches.right) {
            if (!this.branches.right.hasOwnProperty(b)) {
                continue;
            }

            tmp = this.branches.right[b].displayDimensions.length;
            if (maxRightBranches < tmp) {
                maxRightBranches = tmp;
            }
        }

        return Math.max(maxRightHouses, maxRightBranches) + this.rightBranchSpacer;
    }
}

var Cuboid = require("../../components/cuboid.js");
var Point  = require("../../components/point.js");

class Lighttree {
    constructor(origin, dimensions) {
        this._origin = origin;
        this._dimensions = dimensions;
        this._content = null;
        this._children = [];
    };

    get origin() {
        return this._origin;
    };

    get dimensions() {
        return this._dimensions;
    };

    get content() {
        return this._content;
    };

    contentFits(measurements) {
        if (this._content) {
            return false;
        }

        return (this.dimensions.length >= measurements.length && this.dimensions.width >= measurements.width);
    };

    collectCandidates(collection, measurements) {
        if (this._children.length) {
            for (var c of this._children) {
                c.collectCandidates(collection, measurements);
            }
        } else if (this.contentFits(measurements)) {
            collection.push(this);
        }
    };

    collectNodesWithContent(collection) {
        if (this._children.length) {
            for (var c of this._children) {
                c.collectNodesWithContent(collection);
            }
        } else if (this._content) {
            collection.push(this);
        }
    };

    insert(measurements, object) {
        if (!this.contentFits(measurements)) {
            throw 'Already holding contents.'
        }

        // The Objects width, does not perfectly fit the available width.
        // Split the plane in two and insert the object into the fitting one
        if (this.dimensions.width > measurements.width) {

            var o1 = new Point(
                this.origin.x,
                this.origin.y,
                this.origin.z
            );
            var d1 = new Cuboid(
                this.dimensions.length,
                measurements.width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o1, d1));

            var o2 = new Point(
                this.origin.x,
                this.origin.y + measurements.width,
                this.origin.z
            );
            var d2 = new Cuboid(
                this.dimensions.length,
                this.dimensions.width - measurements.width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o2, d2));

            return this._children[0].insert(measurements, object);
        }

        // The Objects length, does not perfectly fit the available length.
        // Split the plane in two and insert the object into the fitting one
        if (this.dimensions.length > measurements.length) {

            var o1 = new Point(
                this.origin.x,
                this.origin.y,
                this.origin.z
            );
            var d1 = new Cuboid(
                measurements.length,
                this.dimensions.width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o1, d1));

            var o2 = new Point(
                this.origin.x + measurements.length,
                this.origin.y,
                this.origin.z
            );
            var d2 = new Cuboid(
                this.dimensions.length - measurements.length,
                this.dimensions.width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o2, d2));

            return this._children[0].insert(measurements, object);
        }

        // Object fits perfectly
        this._content = object;
        return this;
    };
};

module.exports = Lighttree;

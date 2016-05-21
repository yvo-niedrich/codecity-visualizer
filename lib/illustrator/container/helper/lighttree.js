"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cuboid = require("../../components/cuboid.js");
var Point = require("../../components/point.js");

var Lighttree = function () {
    function Lighttree(origin, dimensions) {
        _classCallCheck(this, Lighttree);

        this._origin = origin;
        this._dimensions = dimensions;
        this._content = null;
        this._children = [];
    }

    _createClass(Lighttree, [{
        key: "contentFits",
        value: function contentFits(measurements) {
            if (this._content) {
                return false;
            }

            return this.dimensions.length >= measurements.length && this.dimensions.width >= measurements.width;
        }
    }, {
        key: "collectCandidates",
        value: function collectCandidates(collection, measurements) {
            if (this._children.length) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this._children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var c = _step.value;

                        c.collectCandidates(collection, measurements);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else if (this.contentFits(measurements)) {
                collection.push(this);
            }
        }
    }, {
        key: "collectNodesWithContent",
        value: function collectNodesWithContent(collection) {
            if (this._children.length) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this._children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var c = _step2.value;

                        c.collectNodesWithContent(collection);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else if (this._content) {
                collection.push(this);
            }
        }
    }, {
        key: "insert",
        value: function insert(measurements, object) {
            var cutHorizontalFirst = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            if (!this.contentFits(measurements)) {
                throw 'Object does not fit!';
            }

            var cutOrder = [{ 'method': this.cutIfWidthDoesNotFit.bind(this), 'value': measurements.width }, { 'method': this.cutIfLengthDoesNotFit.bind(this), 'value': measurements.length }];

            if (!cutHorizontalFirst) {
                cutOrder.reverse();
            }

            // If the object would not fit perfectly, we need to cut the
            // area in up to three new (smaller) areas
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = cutOrder[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var cut = _step3.value;

                    cut['method'](cut['value']);

                    if (this._children.length) {
                        return this._children[0].insert(measurements, object, cutHorizontalFirst);
                    }
                }

                // Object fits perfectly
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this._content = object;
            return this;
        }
    }, {
        key: "cutIfWidthDoesNotFit",
        value: function cutIfWidthDoesNotFit(width) {
            // The Objects width, does not perfectly fit the available width.
            // Split the plane in two and insert the object into the fitting one
            if (this.dimensions.width > width) {

                var o1 = new Point(this.origin.x, this.origin.y, this.origin.z);
                var d1 = new Cuboid(this.dimensions.length, width, this.dimensions.height);
                this._children.push(new Lighttree(o1, d1));

                var o2 = new Point(this.origin.x, this.origin.y + width, this.origin.z);
                var d2 = new Cuboid(this.dimensions.length, this.dimensions.width - width, this.dimensions.height);
                this._children.push(new Lighttree(o2, d2));
            }
        }
    }, {
        key: "cutIfLengthDoesNotFit",
        value: function cutIfLengthDoesNotFit(length) {
            // The Objects length, does not perfectly fit the available length.
            // Split the plane in two and insert the object into the fitting one
            if (this.dimensions.length > length) {

                var o1 = new Point(this.origin.x, this.origin.y, this.origin.z);
                var d1 = new Cuboid(length, this.dimensions.width, this.dimensions.height);
                this._children.push(new Lighttree(o1, d1));

                var o2 = new Point(this.origin.x + length, this.origin.y, this.origin.z);
                var d2 = new Cuboid(this.dimensions.length - length, this.dimensions.width, this.dimensions.height);
                this._children.push(new Lighttree(o2, d2));
            }
        }
    }, {
        key: "origin",
        get: function get() {
            return this._origin;
        }
    }, {
        key: "dimensions",
        get: function get() {
            return this._dimensions;
        }
    }, {
        key: "content",
        get: function get() {
            return this._content;
        }
    }]);

    return Lighttree;
}();

;

module.exports = Lighttree;
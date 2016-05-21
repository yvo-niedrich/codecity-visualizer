"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseContainer = require("./base.js");
var RowContainer = require("./row.js");
var ShapeHouse = require("../shapes/house.js");
var ShapeStreet = require("../shapes/street.js");
var Point = require("../components/point.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */

var StreetContainer = function (_BaseContainer) {
    _inherits(StreetContainer, _BaseContainer);

    function StreetContainer(key) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, StreetContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StreetContainer).call(this, key));

        _this._options = {
            'spacer.initial': 15,
            'spacer.branches': 10,
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
        };

        for (var i in options) {
            _this._options[i] = options[i];
        }

        _this._container = {
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
        return _this;
    }

    _createClass(StreetContainer, [{
        key: "_updateDimensions",
        value: function _updateDimensions() {
            this.dimensions.length = this._getContainerLength();
            this.dimensions.width = this._getContainerWidth() + this._options['spacer.conclusive'];
        }
    }, {
        key: "add",
        value: function add(shape) {
            if (shape instanceof StreetContainer) {
                this._addBranch(shape);
            } else if (shape instanceof ShapeHouse) {
                this._addHouse(shape);
            } else if (shape instanceof ShapeStreet) {
                if (this._container.road !== null) {
                    throw 'StreetContainer can only have one road.';
                }
                this._container.road = shape;
            } else {
                throw 'Unknown Shape';
            }
        }
    }, {
        key: "_addHouse",
        value: function _addHouse(shape) {
            var segment, segmentIndex;

            if (this._options['house.segmentation']) {
                segment = shape.getAttribute(this._options['house.segmentation']);
            }

            segment = segment !== null ? segment : 'default';
            segmentIndex = String(segment);

            if (this._container.houses.segments.indexOf(segment) < 0) {
                this._container.houses.segments.push(segment);
                this._container.houses.segmented[segmentIndex] = [];
                this._container.houses.left[segmentIndex] = new this._options['house.container'](this.key + '_' + segmentIndex + '_hl');
                this._container.houses.right[segmentIndex] = new this._options['house.container'](this.key + '_' + segmentIndex + '_hr', true);
                this._container.houses.left[segmentIndex].rotate(-90);
                this._container.houses.right[segmentIndex].rotate(-90);
            }

            this._container.houses.segmented[segmentIndex].push(shape);
        }
    }, {
        key: "_addBranch",
        value: function _addBranch(shape) {
            var segment, segmentIndex;

            if (this._options['branch.segmentation']) {
                segment = shape.getAttribute(this._options['branch.segmentation']);
            }

            segment = segment !== null ? segment : 'default';
            segmentIndex = String(segment);

            if (this._container.branches.segments.indexOf(segment) < 0) {
                this._container.branches.segments.push(segment);
                this._container.branches.segmented[segmentIndex] = [];
                this._container.branches.left[segmentIndex] = new this._options['branch.container'](this.key + '_' + segmentIndex + '_bl');
                this._container.branches.right[segmentIndex] = new this._options['branch.container'](this.key + '_' + segmentIndex + '_br', true);
                this._container.branches.left[segmentIndex].rotate(-90);
                this._container.branches.right[segmentIndex].rotate(-90);
                this._container.branches.left[segmentIndex].separator = this._options['spacer.branches'];
                this._container.branches.right[segmentIndex].separator = this._options['spacer.branches'];
            }

            this._container.branches.segmented[segmentIndex].push(shape);
        }
    }, {
        key: "_finalize",
        value: function _finalize() {
            _get(Object.getPrototypeOf(StreetContainer.prototype), "_finalize", this).call(this);

            if (this._container.road === null) {
                throw 'StreetContainer requires a primary street';
            }
            var mainRoad = this._container.road;

            this._prepareSegments();
            this._addHousesToStructure();
            this._addBranchesToStructure();
            this._updateDimensions();

            var containersBottom = this._options['spacer.initial'] - this.dimensions.width / 2;
            var halfTheRoadLength = mainRoad.displayDimensions.length / 2;
            var middleOfTheRoad = this.dimensions.length / 2 - this._getRightBlockLength() - halfTheRoadLength;

            mainRoad.dimensions.width = this.dimensions.width;
            mainRoad.position.x = middleOfTheRoad;
            mainRoad.position.y = 0;
            _get(Object.getPrototypeOf(StreetContainer.prototype), "add", this).call(this, this._container.road);

            // Place Branches, Segment by Segment
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._container.branches.segments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var bSeg = _step.value;

                    var bKey = String(bSeg),
                        leftBranch = this._container.branches.left[bKey],
                        rightBranch = this._container.branches.right[bKey];

                    if (leftBranch.size) {
                        leftBranch.position.x = middleOfTheRoad - halfTheRoadLength - leftBranch.centroid.x;
                        leftBranch.position.y = containersBottom + leftBranch.centroid.y;
                        _get(Object.getPrototypeOf(StreetContainer.prototype), "add", this).call(this, leftBranch);
                    }

                    if (rightBranch.size) {
                        rightBranch.position.x = middleOfTheRoad + halfTheRoadLength + rightBranch.centroid.x;
                        rightBranch.position.y = containersBottom + rightBranch.centroid.y;
                        _get(Object.getPrototypeOf(StreetContainer.prototype), "add", this).call(this, rightBranch);
                    }

                    containersBottom += Math.max(leftBranch.displayDimensions.width, rightBranch.displayDimensions.width);
                }

                // Add Terra Nullius (if required)
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

            if (this._container.branches.segments.length) {
                containersBottom += this._options['spacer.terranullius'];
            }

            // Place Houses, Segment by Segment
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._container.houses.segments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var hSeg = _step2.value;

                    var hKey = String(hSeg),
                        leftHouse = this._container.houses.left[hKey],
                        rightHouse = this._container.houses.right[hKey];

                    if (leftHouse.size) {
                        leftHouse.position.x = middleOfTheRoad - halfTheRoadLength - leftHouse.centroid.x;
                        leftHouse.position.y = containersBottom + leftHouse.centroid.y;
                        _get(Object.getPrototypeOf(StreetContainer.prototype), "add", this).call(this, leftHouse);
                    }

                    if (rightHouse.size) {
                        rightHouse.position.x = middleOfTheRoad + halfTheRoadLength + rightHouse.centroid.x;
                        rightHouse.position.y = containersBottom + rightHouse.centroid.y;
                        _get(Object.getPrototypeOf(StreetContainer.prototype), "add", this).call(this, rightHouse);
                    }

                    containersBottom += Math.max(leftHouse.displayDimensions.width, rightHouse.displayDimensions.width);
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
        }
    }, {
        key: "_prepareSegments",
        value: function _prepareSegments() {
            var houseOrder = typeof this._options['house.segmentorder'] === 'function' ? this._options['branch.segmentorder'] : function (a, b) {
                return a - b;
            };
            var branchOrder = typeof this._options['branch.segmentorder'] === 'function' ? this._options['branch.segmentorder'] : function (a, b) {
                return a - b;
            };
            this._container.houses.segments.sort(houseOrder);
            this._container.branches.segments.sort(branchOrder);
        }
    }, {
        key: "_addHousesToStructure",
        value: function _addHousesToStructure() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._container.houses.segments[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var segment = _step3.value;

                    var key = String(segment);

                    this._distributeShapes(this._container.houses.segmented[key], this._options['house.distribution'], this._container.houses.left[key], this._container.houses.right[key]);
                }
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
        }
    }, {
        key: "_addBranchesToStructure",
        value: function _addBranchesToStructure() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._container.branches.segments[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var segment = _step4.value;

                    var key = String(segment);

                    this._distributeShapes(this._container.branches.segmented[key], this._options['branch.distribution'], this._container.branches.left[key], this._container.branches.right[key]);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: "_distributeShapes",
        value: function _distributeShapes(shapes, method, left, right) {
            if (typeof method === 'function') {
                this._distributeShapesEquallyByAttribute(shapes, method, left, right);
                return;
            }

            if (typeof method !== 'string') {
                throw 'Unknown type of distribution';
            }

            if (method.toLowerCase() === 'left') {
                this._distributeShapesToContainer(shapes, left);
            } else if (method.toLowerCase() === 'right') {
                this._distributeShapesToContainer(shapes, right);
            } else {
                this._distributeShapesInDefaultOrder(shapes, left, right);
            }
        }
    }, {
        key: "_distributeShapesToContainer",
        value: function _distributeShapesToContainer(shapes, container) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = shapes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var s = _step5.value;

                    container.add(s);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }, {
        key: "_distributeShapesInDefaultOrder",
        value: function _distributeShapesInDefaultOrder(shapes, left, right) {
            for (var key in shapes) {
                if (shapes.hasOwnProperty(key)) {
                    var c = key % 2 ? left : right;
                    c.add(shapes[key]);
                }
            }
        }
    }, {
        key: "_distributeShapesEquallyByAttribute",
        value: function _distributeShapesEquallyByAttribute(shapes, attr, left, right) {
            shapes.sort(function (a, b) {
                return attr(b) - attr(a);
            });
            var diff = 0;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = shapes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var s = _step6.value;

                    if (diff <= 0) {
                        left.add(s);
                        diff += attr(s);
                    } else {
                        right.add(s);
                        diff -= attr(s);
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        }
    }, {
        key: "_getContainerWidth",
        value: function _getContainerWidth() {
            var houseWidth = this._getHousesBlockTotalWidth();
            var branchWidth = this._getBranchesBlockTotalWidth();
            var containerMargin = branchWidth && houseWidth ? this._options['spacer.terranullius'] : 0;
            return houseWidth + branchWidth + this._options['spacer.initial'] + containerMargin;
        }
    }, {
        key: "_getHousesBlockTotalWidth",
        value: function _getHousesBlockTotalWidth() {
            var maxLeftHouses = 0,
                maxRightHouses = 0,
                tmp;

            for (var l in this._container.houses.left) {
                tmp = this._container.houses.left[l].displayDimensions.width;
                if (maxLeftHouses < tmp) {
                    maxLeftHouses = tmp;
                }
            }

            for (var r in this._container.houses.right) {
                tmp = this._container.houses.right[r].displayDimensions.width;
                if (maxRightHouses < tmp) {
                    maxRightHouses = tmp;
                }
            }

            return Math.max(maxLeftHouses, maxRightHouses);
        }
    }, {
        key: "_getBranchesBlockTotalWidth",
        value: function _getBranchesBlockTotalWidth() {
            var maxLeftBranches = 0,
                maxRightBranches = 0,
                tmp;

            for (var l in this._container.branches.left) {
                tmp = this._container.branches.left[l].displayDimensions.width;
                if (maxLeftBranches < tmp) {
                    maxLeftBranches = tmp;
                }
            }

            for (var r in this._container.branches.right) {
                tmp = this._container.branches.right[r].displayDimensions.width;
                if (maxRightBranches < tmp) {
                    maxRightBranches = tmp;
                }
            }

            return Math.max(maxLeftBranches, maxRightBranches);
        }
    }, {
        key: "_getContainerLength",
        value: function _getContainerLength() {
            var leftLength = this._getLeftBlockLength();
            var rightLength = this._getRightBlockLength();

            return leftLength + this._container.road.displayDimensions.length + rightLength;
        }
    }, {
        key: "_getLeftBlockLength",
        value: function _getLeftBlockLength() {
            var maxLeftHouses = 0,
                maxLeftBranches = 0,
                tmp;

            for (var h in this._container.houses.left) {
                tmp = this._container.houses.left[h].displayDimensions.length;
                if (maxLeftHouses < tmp) {
                    maxLeftHouses = tmp;
                }
            }

            for (var b in this._container.branches.left) {
                tmp = this._container.branches.left[b].displayDimensions.length;
                if (maxLeftBranches < tmp) {
                    maxLeftBranches = tmp;
                }
            }

            return Math.max(maxLeftHouses, maxLeftBranches);
        }
    }, {
        key: "_getRightBlockLength",
        value: function _getRightBlockLength() {
            var maxRightHouses = 0,
                maxRightBranches = 0,
                tmp;

            for (var h in this._container.houses.right) {
                tmp = this._container.houses.right[h].displayDimensions.length;
                if (maxRightHouses < tmp) {
                    maxRightHouses = tmp;
                }
            }

            for (var b in this._container.branches.right) {
                tmp = this._container.branches.right[b].displayDimensions.length;
                if (maxRightBranches < tmp) {
                    maxRightBranches = tmp;
                }
            }

            return Math.max(maxRightHouses, maxRightBranches);
        }
    }]);

    return StreetContainer;
}(BaseContainer);

module.exports = StreetContainer;
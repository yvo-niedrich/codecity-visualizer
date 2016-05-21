"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseIllustrator = require("./base.js");
var Point = require("./components/point.js");
var Illustration = require('./components/illustration.js');
var ShapeHouse = require("./shapes/house.js");
var ShapeStreet = require("./shapes/street.js");
var ShapeContainer = require("./container/streetcontainer.js");

/**
 * Create an evostreet city
 *
 * @implements BaseIllustrator
 */

var Evostreet = function (_BaseIllustrator) {
    _inherits(Evostreet, _BaseIllustrator);

    function Evostreet(model) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Evostreet);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Evostreet).call(this, model, options));

        _this._rules = [];
        _this._model = model;
        _this._options = {
            'highway.length': 36,
            'highway.color': 0x156289,

            'street.length': 18,
            'street.color': 0x156289,

            'house.length': 16,
            'house.width': 16,
            'house.height': 16,
            'house.margin': 3,
            'house.color': 0x1A212E,

            'evostreet.container': ShapeContainer,
            'evostreet.options': {}
        };

        for (var i in options) {
            _this._options[i] = options[i];
        }
        return _this;
    }

    _createClass(Evostreet, [{
        key: "addRule",
        value: function addRule(rule) {
            this._rules.push(rule);
        }
    }, {
        key: "draw",
        value: function draw(version) {
            var spatialModel = this._createSpatialModel(this._model.tree, version);

            var origin = new Point(0, 0, 0);
            var rotation = 0;
            spatialModel.draw(origin, rotation);

            var illustration = new Illustration(version);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = spatialModel.getSpatialInformation()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var shape = _step.value;

                    illustration.addShape(shape);
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

            return illustration;
        }
    }, {
        key: "_createSpatialModel",
        value: function _createSpatialModel(tree, version) {
            if (!tree.children.length) {
                return this._createHouse(tree, version);
            }

            var container = new this._options['evostreet.container'](tree, this._options['evostreet.options']);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = tree.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var child = _step2.value;

                    container.add(this._createSpatialModel(child, version));
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

            if (tree.parent === null) {
                container.add(this._createHighway(tree, version));
            } else {
                container.add(this._createStreet(tree, version));
            }

            return container;
        }
    }, {
        key: "_createHighway",
        value: function _createHighway(node, version) {
            var defaultLayout = {
                'dimensions.length': this._options['highway.length'],
                'dimensions.height': 1,
                'color': this._options['highway.color']
            };

            var highway = new ShapeStreet(node);
            highway.updateAttributes(defaultLayout);
            this._applyRules(node, version, highway);
            return highway;
        }
    }, {
        key: "_createStreet",
        value: function _createStreet(node, version) {
            var defaultLayout = {
                'dimensions.length': this._options['street.length'],
                'dimensions.height': 1,
                'color': this._options['street.color']
            };

            var street = new ShapeStreet(node);
            street.updateAttributes(defaultLayout);
            this._applyRules(node, version, street);
            return street;
        }
    }, {
        key: "_createHouse",
        value: function _createHouse(node, version) {
            var defaultLayout = {
                'dimensions.length': this._options['house.length'],
                'dimensions.width': this._options['house.width'],
                'dimensions.height': this._options['house.height'],
                'margin': this._options['house.margin'],
                'color': this._options['house.color']
            };

            var house = new ShapeHouse(node);
            house.updateAttributes(defaultLayout);
            this._applyRules(node, version, house);
            return house;
        }
    }, {
        key: "_applyRules",
        value: function _applyRules(node, version, shape) {
            var attributes = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._rules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var rule = _step3.value;

                    Object.assign(attributes, rule(node, version, this._model));
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

            shape.updateAttributes(attributes);
        }
    }]);

    return Evostreet;
}(BaseIllustrator);

module.exports = Evostreet;
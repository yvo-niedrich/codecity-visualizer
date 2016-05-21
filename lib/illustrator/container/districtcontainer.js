"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseContainer = require("./base.js");
var LightmapContainer = require("./lightmap.js");
var ShapeHouse = require("../shapes/house.js");
var ShapePlatform = require("../shapes/platform.js");
var Point = require("../components/point.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */

var DistrictContainer = function (_BaseContainer) {
    _inherits(DistrictContainer, _BaseContainer);

    function DistrictContainer(key) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, DistrictContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DistrictContainer).call(this, key));

        _this._options = {
            'spacer.margin': 10,
            'spacer.padding': 5,

            'platform.height': 10,

            'district.container': LightmapContainer,
            'district.options': false,

            'houses.container': LightmapContainer,
            'houses.options': {}
        };

        for (var i in options) {
            _this._options[i] = options[i];
        }

        _this._container = {
            'houses': new _this._options['houses.container'](_this.key + '_d', _this._options['houses.options']),
            'districts': new _this._options['district.container'](_this.key + '_d', _this._options['district.options']),
            'platform': null
        };
        _get(Object.getPrototypeOf(DistrictContainer.prototype), "add", _this).call(_this, _this._container.districts);
        return _this;
    }

    _createClass(DistrictContainer, [{
        key: "_updateDimensions",
        value: function _updateDimensions() {
            this.dimensions.length = this._getContainerLength();
            this.dimensions.width = this._getContainerWidth() + this._options['spacer.conclusive'];
        }
    }, {
        key: "add",
        value: function add(shape) {
            if (shape instanceof BaseContainer) {
                this._container.districts.add(shape);
            } else if (shape instanceof ShapeHouse) {
                this._container.houses.add(shape);
            } else if (shape instanceof ShapePlatform) {
                if (this._container.platform !== null) {
                    throw 'StreetContainer can only have one road.';
                }

                this._container.platform = shape;
            } else {
                throw 'Unbekannter Shape-Typ';
            }
        }
    }, {
        key: "_finalize",
        value: function _finalize() {
            _get(Object.getPrototypeOf(DistrictContainer.prototype), "_finalize", this).call(this);

            this._container.districts.add(this._container.houses);

            var padding = 2 * this._options['spacer.padding'];
            this.dimensions.length = this._container.districts.displayDimensions.length + padding;
            this.dimensions.width = this._container.districts.displayDimensions.width + padding;
            this.dimensions.height = this._container.districts.displayDimensions.height;

            this._createPlatform();

            var margin = 2 * this._options['spacer.margin'];
            this.dimensions.length += margin;
            this.dimensions.width += margin;
        }
    }, {
        key: "_createPlatform",
        value: function _createPlatform() {
            if (!this._container.platform) {
                this._container.platform = new ShapePlatform(this.key + '_p');
            }

            this._container.platform.dimensions.length = this.dimensions.length;
            this._container.platform.dimensions.width = this.dimensions.width;
            this._container.platform.dimensions.height = this._options['platform.height'];
            this._container.platform.position.z = -this._options['platform.height'];

            // Lift everything else above the platform
            this.position.z += this._options['platform.height'];

            _get(Object.getPrototypeOf(DistrictContainer.prototype), "add", this).call(this, this._container.platform);
        }
    }]);

    return DistrictContainer;
}(BaseContainer);

module.exports = DistrictContainer;
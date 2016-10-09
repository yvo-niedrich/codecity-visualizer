var CCV = require('../app');
var Evostreet = CCV.illustrators.evostreet;
var GridContainer = CCV.containers.grid;
var LightmapContainer = CCV.containers.lightmap;
var RowContainer = CCV.containers.row;
var attributeHelper = CCV.helper.attributes;
var Rule = CCV.rules.math.linear;
var Model = CCV.models.dummy;

var model = new Model();
var versions = model.getVersions();
var rule = new Rule({
    'condition': function(model, node) { return node.children.length === 0; },
    'metric': function(model, node, version) {
        const attr = attributeHelper.attrFallbackSweep(model, node, version);
        return ('loc' in attr) ? attr['loc'] : 0;
    },
    'attributes': ['dimensions.length', 'dimensions.width'],
    'min': 2,
    'max': 40
});

describe("Evostreet", function() {
    it("builds an evolutional city", function () {
        var options = {};
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("evolutional city prevents snails", function () {
        var options = { 'layout.snail': false };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(64);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Distribution: left", function () {
        var options = {
            'evostreet.options' : {
                'house.distribution': 'left',
                'branch.distribution': 'left'
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Distribution: right", function () {
        var options = {
            'evostreet.options' : {
                'house.distribution': 'right',
                'branch.distribution': 'right'
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Distribution: alternating by size", function () {
        var options = {
            'evostreet.options' : {
                'house.distribution': function(s) { return s.displayDimensions.base; },
                'branch.distribution': function(s) { return s.displayDimensions.base; }
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Segmentation by key (1 Element each)", function () {
        var options = {
            'evostreet.options': {
                'house.segmentation': (s) => s.key,
                'house.segmentorder': (a, b) => a === b ? 0 : (a > b ? 1 : -1),
                'branch.segmentation': (s) => s.key,
                'branch.segmentorder': (a, b) => a === b ? 0 : (a > b ? 1 : -1)
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Segmentation by 1. char of key", function () {
        var options = {
            'evostreet.options': {
                'house.segmentation': (s) => String(s.getAttribute('key')).toLowerCase().substr(0,1),
                'house.segmentorder': (a, b) => a === b ? 0 : (a > b ? 1 : -1),
                'branch.segmentation': (s) => String(s.getAttribute('key')).toLowerCase().substr(0,1),
                'branch.segmentorder': (a, b) => a === b ? 0 : (a > b ? 1 : -1)
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Platforms are drawn below houses", function () {
        var options = {
            'evostreet.options' : {
                'house.platforms': {}
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(85);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Platforms are drawn below houses (distributed to one side)", function () {
        var options = {
            'evostreet.options' : {
                'house.distribution': 'left',
                'house.platforms': {},
                'branch.distribution': 'left'
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(76);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("builds an evolutional city with grid-container", function () {
        var options = {
            'evostreet.options': {
                'branch.container': function(key, mirror) {
                    return new GridContainer(key, mirror);
                },
                'house.container': function(key, mirror) {
                    return new GridContainer(key, mirror);
                },
                'log': true
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);

        expect(illustration.shapes[63].key).toBe('elephant');
        expect(illustration.shapes[63].type).toBe('house');
        expect(illustration.shapes[63].dimensions.length).toBe(40);
        expect(illustration.shapes[63].dimensions.width).toBe(40);
        expect(illustration.shapes[63].dimensions.height).toBe(12);
        expect(illustration.shapes[63].position.x).not.toBe(0);
        expect(illustration.shapes[63].position.y).not.toBe(0);
        expect(illustration.shapes[63].position.z).toBe(0);
    });

    it("builds an evolutional city with grid-container and platforms", function () {
        var options = {
            'evostreet.options': {
                'branch.container': function(key, mirror) {
                    return new GridContainer(key, mirror);
                },
                'house.container': function(key, mirror) {
                    return new GridContainer(key, mirror);
                },
                'house.platforms': {
                    "dimensions.height": 1,
                    color: 0xFFFFFF
                }
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(85);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);

        expect(illustration.shapes[80].key).toBe('elephant');
        expect(illustration.shapes[80].type).toBe('house');
        expect(illustration.shapes[80].dimensions.length).toBe(40);
        expect(illustration.shapes[80].dimensions.width).toBe(40);
        expect(illustration.shapes[80].dimensions.height).toBe(12);
        expect(illustration.shapes[80].position.x).not.toBe(0);
        expect(illustration.shapes[80].position.y).not.toBe(0);
        expect(illustration.shapes[80].position.z).toBe(1);
    });

    it("builds an evolutional city with lightmap-container", function () {
        var options = {
            'branch.container': function(key, mirror) {
                return new LightmapContainer(key, mirror);
            },
            'evostreet.options': {
                'house.container': function(key, mirror) {
                    return new LightmapContainer(key, mirror);
                }
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);

        expect(illustration.shapes[63].key).toBe('elephant');
        expect(illustration.shapes[63].type).toBe('house');
        expect(illustration.shapes[63].dimensions.length).toBe(40);
        expect(illustration.shapes[63].dimensions.width).toBe(40);
        expect(illustration.shapes[63].dimensions.height).toBe(12);
        expect(illustration.shapes[63].position.x).not.toBe(0);
        expect(illustration.shapes[63].position.y).not.toBe(0);
        expect(illustration.shapes[63].position.z).toBe(0);
    });

    it("builds an evolutional city with row-container", function () {
        var options = {
            'evostreet.options': {
                'branch.container': function(key, mirror) {
                    return new RowContainer(key, mirror);
                },
                'house.container': function(key, mirror) {
                    return new RowContainer(key, mirror);
                }
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);

        expect(illustration.shapes[63].key).toBe('elephant');
        expect(illustration.shapes[63].type).toBe('house');
        expect(illustration.shapes[63].dimensions.length).toBe(40);
        expect(illustration.shapes[63].dimensions.width).toBe(40);
        expect(illustration.shapes[63].dimensions.height).toBe(12);
        expect(illustration.shapes[63].position.x).not.toBe(0);
        expect(illustration.shapes[63].position.y).not.toBe(0);
        expect(illustration.shapes[63].position.z).toBe(0);
    });
});
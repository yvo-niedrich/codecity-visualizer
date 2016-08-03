var CCV = require('../app');
var District = CCV.illustrators.district;
var Evostreet = CCV.illustrators.evostreet;
var attributeHelper = CCV.helper.attributes;
var Rule = CCV.rules.math.linear;
var Model = CCV.models.dummy;

var model = new Model();
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
        var versionToDraw = model.versions[1];
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
        var versionToDraw = model.versions[1];
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
        var versionToDraw = model.versions[1];
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
        var versionToDraw = model.versions[1];
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
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(66);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });

    it("Segmentation by key (1 Element each)", function () {
        var options = {
            'evostreet.options': {
                'house.segmentation': function(s) { return s.key; },
                'house.segmentorder': (a, b) => a === b ? 0 : (a > b ? 1 : -1),
                'branch.segmentation': function(s) { return s.key; },
                'branch.segmentorder': (a, b) => a === b ? 0 : (a > b ? 1 : -1)
            }
        };
        var illustrator = new Evostreet(model, options);

        illustrator.addRule(rule);
        var versionToDraw = model.versions[1];
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
        var versionToDraw = model.versions[1];
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
        var versionToDraw = model.versions[1];
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
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        expect(illustration.version).toBe(versionToDraw);
        expect(illustration.shapes.length).toBe(76);
        expect(illustration.shapes[0].rotation).toBe(0);
        expect(illustration.shapes[1].rotation).not.toBe(0);
    });
});

describe("District", function() {
    it("builds a district city", function () {
        var options = {};
        var illustrator = new District(model, options);

        illustrator.addRule(rule);
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        var illustrationCount = illustration.shapes.length;
        expect(illustration.version).toBe(versionToDraw);
        expect(illustrationCount).toBe(66);
        expect(illustration.shapes[0].position.z).toBe(30);
        expect(illustration.shapes[illustrationCount-1].position.z).toBe(0);
    });

    it("district city prevents towers", function () {
        var options = { 'layout.tower': false };
        var illustrator = new District(model, options);

        illustrator.addRule(rule);
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        var illustrationCount = illustration.shapes.length;
        expect(illustration.version).toBe(versionToDraw);
        expect(illustrationCount).toBe(64);
        expect(illustration.shapes[0].position.z).toBe(30);
        expect(illustration.shapes[illustrationCount-1].position.z).toBe(0);
    });
});
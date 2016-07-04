var District = require('../lib/illustrator/district');
var Evostreet = require('../lib/illustrator/evostreet');
var attributeHelper = require('../lib/model/helper/attributeExtractor');
var ExponentRule = require('../lib/illustrator/rules/math/linear');
var Model = require('../lib/model/dummy');

var model = new Model();
var rule = new ExponentRule({
    'condition': function(model, node) { return node.children.length === 0; },
    'metric': function(model, node, version) {
        const attr = attributeHelper.attrFallbackSweep(model, node, version);
        return ('editors' in attr) ? attr['editors'] : 0;
    },
    'attributes': ['dimensions.length', 'dimensions.width'],
    'min': 10,
    'max': 65,
    'logexp': 2.95,
    'logbase': 2
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
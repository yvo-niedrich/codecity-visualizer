var CCV = require('../app');
var District = CCV.illustrators.district;
var GridContainer = CCV.containers.grid;
var LightmapContainer = CCV.containers.lightmap;
var RowContainer = CCV.containers.row;
var attributeHelper = CCV.helper.attributes;
var Rule = CCV.rules.math.linear;
var ColorRule = CCV.rules.color.gradient;
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

describe("District", function() {
    it("builds a district city", function () {
        var decreasePlatformHeight = function (a, b) {
            var p = new CCV.containers.platform(a, b);
            p.setOption("dimensions.height", 5);
            return p;
        };

        var options = {
            "district.options" : {
                "platform.container": decreasePlatformHeight
            }
        };
        var illustrator = new District(model, options);

        illustrator.addRule(rule);
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        var illustrationCount = illustration.shapes.length;
        expect(illustration.version).toBe(versionToDraw);
        expect(illustrationCount).toBe(66);
        expect(illustration.shapes[0].position.z).toBe(15);
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

    it("district city paints platforms", function () {
        var options = { 'layout.tower': false };
        var illustrator = new District(model, options);

        illustrator.addRule(rule);
        illustrator.addRule(new ColorRule({
            'condition': function(model, node) {
                return node.children.length !== 0;
            },
            'metric': function(model, node) {
                var level = 0;
                var tnode = node.parent
                while(tnode) {
                    tnode = tnode.parent;
                    level++;
                }
                return level;
            },
            'attributes': 'color',
            'max': 10,
            'minColor': 0x111111,
            'maxColor': 0xCCCCCC
        }));

        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        var illustrationCount = illustration.shapes.length;
        expect(illustration.version).toBe(versionToDraw);
        expect(illustrationCount).toBe(64);

        expect(illustration.shapes[63].key).toBe("zoo");
        expect(illustration.shapes[63].type).toBe("platform");
        expect(illustration.shapes[63].color).toBe(0x111111);

        expect(illustration.shapes[33].key).toBe("cats");
        expect(illustration.shapes[33].type).toBe("platform");
        expect(illustration.shapes[33].color).toBeCloseTo(0x363636, 0);

        expect(illustration.shapes[62].key).toBe("reptiles");
        expect(illustration.shapes[62].type).toBe("platform");
        expect(illustration.shapes[62].color).not.toBe(0);
        expect(illustration.shapes[62].color).toBeCloseTo(0x232324, 0);
    });

    it("builds a district city with grid-container", function () {
        var options = {
            "district.options" : {
                'house.container': function(key, mirror) {
                    return new GridContainer(key, mirror);
                }
            }
        };
        var illustrator = new District(model, options);

        illustrator.addRule(rule);
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        var illustrationCount = illustration.shapes.length;
        expect(illustration.version).toBe(versionToDraw);
        expect(illustrationCount).toBe(66);
        expect(illustration.shapes[0].position.z).toBe(30);
        expect(illustration.shapes[illustrationCount-1].position.z).toBe(0);

        expect(illustration.shapes[60].key).toBe('elephant');
        expect(illustration.shapes[60].type).toBe('house');
        expect(illustration.shapes[60].dimensions.length).toBe(40);
        expect(illustration.shapes[60].dimensions.width).toBe(40);
        expect(illustration.shapes[60].dimensions.height).toBe(12);
        expect(illustration.shapes[60].position.x).not.toBe(0);
        expect(illustration.shapes[60].position.y).not.toBe(0);
        expect(illustration.shapes[60].position.z).toBe(20);
    });

    it("builds a district city with lightmap-container", function () {
        var options = {
            "district.options" : {
                'house.container': function(key, mirror) {
                    return new LightmapContainer(key, mirror);
                }
            }
        };
        var illustrator = new District(model, options);

        illustrator.addRule(rule);
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        var illustrationCount = illustration.shapes.length;
        expect(illustration.version).toBe(versionToDraw);
        expect(illustrationCount).toBe(66);
        expect(illustration.shapes[0].position.z).toBe(30);
        expect(illustration.shapes[illustrationCount-1].position.z).toBe(0);

        expect(illustration.shapes[60].key).toBe('elephant');
        expect(illustration.shapes[60].type).toBe('house');
        expect(illustration.shapes[60].dimensions.length).toBe(40);
        expect(illustration.shapes[60].dimensions.width).toBe(40);
        expect(illustration.shapes[60].dimensions.height).toBe(12);
        expect(illustration.shapes[60].position.x).not.toBe(0);
        expect(illustration.shapes[60].position.y).not.toBe(0);
        expect(illustration.shapes[60].position.z).toBe(20);
    });

    it("builds a district city with row-container", function () {
        var options = {
            "district.options" : {
                'house.container': function(key, mirror) {
                    return new RowContainer(key, mirror);
                }
            }
        };
        var illustrator = new District(model, options);

        illustrator.addRule(rule);
        var versionToDraw = model.versions[1];
        var illustration = illustrator.draw(versionToDraw);

        var illustrationCount = illustration.shapes.length;
        expect(illustration.version).toBe(versionToDraw);
        expect(illustrationCount).toBe(66);
        expect(illustration.shapes[0].position.z).toBe(30);
        expect(illustration.shapes[illustrationCount-1].position.z).toBe(0);

        expect(illustration.shapes[60].key).toBe('elephant');
        expect(illustration.shapes[60].type).toBe('house');
        expect(illustration.shapes[60].dimensions.length).toBe(40);
        expect(illustration.shapes[60].dimensions.width).toBe(40);
        expect(illustration.shapes[60].dimensions.height).toBe(12);
        expect(illustration.shapes[60].position.x).not.toBe(0);
        expect(illustration.shapes[60].position.y).not.toBe(0);
        expect(illustration.shapes[60].position.z).toBe(20);
    });
});
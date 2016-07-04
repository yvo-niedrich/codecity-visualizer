var JasmineRuleModel = require('./helper/jasmineRuleModel');

const m = new JasmineRuleModel();
const root = m.tree;
const leaf = root.children[0];
const v = m.versions[0];

describe("Color/Assigned", function () {
    it('Color is randomized', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value4']; },
            'attributes': 'testResult'
        };

        var rule = new (require('../../lib/illustrator/rules/color/assigned'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);
        
        expect(res1.testResult).not.toBeUndefined();
        expect(res2.testResult).not.toBeUndefined();
        expect(res1.testResult).not.toBe(res2.testResult);
    });
});

describe("Color/Gradient", function () {
    it('Gradient Color working', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value2']; },
            'attributes': 'testResult',
            'min': 0,
            'max': 60,
            'minColor': 0x00CC00,
            'maxColor': 0xFF0000
        };

        var rule = new (require('../../lib/illustrator/rules/color/gradient'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(0x04C800);
        expect(res2.testResult).toBe(0xD42200);
    });

    it('Gradient Min/Max working', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value2']; },
            'attributes': 'testResult',
            'min': 15,
            'max': 45,
            'minColor': 0x00CC00,
            'maxColor': 0xFF0000
        };

        var rule = new (require('../../lib/illustrator/rules/color/gradient'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(0x00CC00);
        expect(res2.testResult).toBe(0xFF0000);
    });
});

describe("Math/Exponential", function () {
    it('Exponential function works', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value1']; },
            'attributes': 'testResult'
        };

        var rule = new (require('../../lib/illustrator/rules/math/exponential'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(0);
        expect(res2.testResult).toBe(10000);
    });
});
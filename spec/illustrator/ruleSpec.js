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
        expect(0x000000 <= res1.testResult && res1.testResult <= 0xFFFFFF).toBeTruthy();
        expect(0x000000 <= res2.testResult && res2.testResult <= 0xFFFFFF).toBeTruthy();
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

describe("Math/Logarithmic", function () {
    it('logarithmic function works', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value2']; },
            'attributes': 'testResult'
        };

        var rule = new (require('../../lib/illustrator/rules/math/logarithmic'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(1);
        expect(res2.testResult).toBeCloseTo(5.67, 1);
    });

    it('logarithmic function works with other bases', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value2']; },
            'attributes': 'testResult',
            'logbase': 3.21
        };

        var rule = new (require('../../lib/illustrator/rules/math/logarithmic'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBeCloseTo(0.6, 1);
        expect(res2.testResult).toBeCloseTo(3.37, 2);
    });
});

describe("Math/Linear", function () {
    it('Linear function works', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value3']; },
            'attributes': 'testResult'
        };

        var rule = new (require('../../lib/illustrator/rules/math/linear'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(21);
        expect(res2.testResult).toBe(6);
    });

    it('Linear function scales', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value3']; },
            'attributes': 'testResult',
            'factor': 1.5
        };

        var rule = new (require('../../lib/illustrator/rules/math/linear'))(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(31.5);
        expect(res2.testResult).toBe(9);
    });
});
var JasmineRuleModel = require('./helper/jasmineRuleModel');
var CCV = require('../../app');

const m = new JasmineRuleModel();
const root = m.tree;
const leaf = root.children[0];
const v = m.versions[0];

describe("Rule/Universal", function () {
    it('is works by default', function () {
        const options = {
            'attributes': 'testResult'
        };

        var rule = new CCV.rules.universal(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(0);
        expect(res2.testResult).toBe(0);
    });

    it('is works when partially configured', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value3']; },
            'attributes': 'testResult'
        };

        var rule = new CCV.rules.universal(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(21);
        expect(res2.testResult).toBe(6);
    });

    it('is works when fully configured', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value3']; },
            'applyRule': function(metricValue) { return metricValue * 2; },
            'attributes': 'testResult'
        };

        var rule = new CCV.rules.universal(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(42);
        expect(res2.testResult).toBe(12);
    });

    it('is works when fully configured for Strings', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value3']; },
            'applyRule': function(metricValue) { return metricValue < 10 ? 'a' : 'b'; },
            'attributes': 'testResult'
        };

        var rule = new CCV.rules.universal(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe('b');
        expect(res2.testResult).toBe('a');
    });
});

describe("Color/Assigned", function () {
    it('Color is randomized', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value4']; },
            'attributes': 'testResult'
        };

        var rule = new CCV.rules.color.assigned(options);
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

        var rule = new CCV.rules.color.gradient(options);
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

        var rule = new CCV.rules.color.gradient(options);
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

        var rule = new CCV.rules.math.exponential(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(0);
        expect(res2.testResult).toBe(10000);
    });

    it('Modified exponential function works', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value1']; },
            'attributes': 'testResult',
            'min': 5,
            'factor': .5
        };

        var rule = new CCV.rules.math.exponential(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(5);
        expect(res2.testResult).toBe(5000);
    });
});

describe("Math/Logarithmic", function () {
    it('logarithmic function works', function () {
        const options = {
            'condition': function() { return true },
            'metric': function(model, node) { return model.attributes(node)['test.value2']; },
            'attributes': 'testResult'
        };

        var rule = new CCV.rules.math.logarithmic(options);
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

        var rule = new CCV.rules.math.logarithmic(options);
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

        var rule = new CCV.rules.math.linear(options);
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

        var rule = new CCV.rules.math.linear(options);
        var res1 = rule.execute(m, root, v);
        var res2 = rule.execute(m, leaf, v);

        expect(res1.testResult).toBe(31.5);
        expect(res2.testResult).toBe(9);
    });
});
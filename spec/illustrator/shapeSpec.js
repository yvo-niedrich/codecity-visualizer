var BaseShape = require('../../app').shapes.base;

describe("Shape", function () {
    it('updates it\'s size', function () {
        const s = new BaseShape('demo');
        expect(s.displayDimensions.base).toBe(0);
        expect(s.displayDimensions.length).toBe(0);
        expect(s.displayDimensions.width).toBe(0);
        expect(s.displayDimensions.height).toBe(0);

        s.updateAttributes({
            'dimensions.length': 5,
            'dimensions.width': 5
        });

        expect(s.displayDimensions.base).not.toBe(0);
        expect(s.displayDimensions.length).toBe(5);
        expect(s.displayDimensions.width).toBe(5);
        expect(s.displayDimensions.height).toBe(0);
    });

    it('direct and indirect attributes behave', function () {
        const s = new BaseShape('demo');
        expect(s.displayDimensions.length).toBe(0);
        expect(s.getAttribute('dimensions.length')).toBe(0);
        expect(s.getAttribute('unknown.value')).toBeUndefined();

        s.updateAttributes({
            'dimensions.length': 5,
            'dimensions.width': 5,
            'unknown.value': 'known'
        });

        expect(s.displayDimensions.length).toBe(5);
        expect(s.getAttribute('dimensions.length')).toBe(5);
        expect(s.getAttribute('unknown.value')).toBe('known');
    });

    it('rotation is consistent', function () {
        const s = new BaseShape('demo');
        expect(s.rotation).toBe(0);

        s.rotate(90);
        expect(s.rotation).toBe(90);

        s.rotate(90);
        expect(s.rotation).toBe(180);

        s.rotate(450);
        expect(s.rotation).toBe(270);

        s.rotate(-270);
        expect(s.rotation).toBe(0);
    });

    it('rotations only except 90°', function () {
        const s = new BaseShape('demo');
        expect(function() {s.rotate(25); }).toThrow();
        expect(function() {s.rotate(33); }).toThrow();
        expect(function() {s.rotate(23); }).toThrow();
        expect(function() {s.rotate(-1); }).toThrow();
        expect(function() {s.rotate(-1024); }).toThrow();
        expect(function() {s.rotate(-90); }).not.toThrow();
        expect(function() {s.rotate(180); }).not.toThrow();
    });

    it('displayDimensions are rotated', function () {
        const s = new BaseShape('demo');
        s.updateAttributes({'dimensions.length': 5});

        expect(s.displayDimensions.length).toBe(5);
        expect(s.displayDimensions.width).toBe(0);
        expect(s.displayDimensions.height).toBe(0);

        s.rotate(90);

        expect(s.displayDimensions.length).toBe(0);
        expect(s.displayDimensions.width).toBe(5);
        expect(s.displayDimensions.height).toBe(0);

        s.updateAttributes({'dimensions.width': 5});

        expect(s.displayDimensions.length).toBe(5);
        expect(s.displayDimensions.width).toBe(5);
        expect(s.displayDimensions.height).toBe(0);
    });
});
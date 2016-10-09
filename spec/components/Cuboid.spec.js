var CCV = require('../../app');
var Cuboid = CCV.components.cuboid;

describe("Cuboid", function() {
    it("can propagate its dimensions", function() {
        var cube = new Cuboid(5, 6, 16);
        expect(cube.length).toBe(5);
        expect(cube.width).toBe(6);
        expect(cube.height).toBe(16);
    });

    it("can propagate complex information", function() {
        var cube = new Cuboid(5, 6, 16);
        expect(cube.diagonal).toBeCloseTo(17.8, 1);
        expect(cube.base).toBeCloseTo(7.81, 2);
    });
});

var CCV = require('../../app');
var RowContainer = CCV.containers.row;
var GridContainer = CCV.containers.grid;
var LightmapContainer = CCV.containers.lightmap;
var Shape = CCV.shapes.base;
var Point = require('../../lib/illustrator/components/point');

describe("RowContainer", function () {
    it('puts elements on top of each other', function () {
        /* |----|
         * | 2  |
         * |----|
         * |----------|
         * |          |
         * |    1     |
         * |          |
         * |----------|
         */

        var container = new RowContainer('test');

        var s1 = new Shape('s1');
        s1.updateAttributes({
            'dimensions.width': 5,
            'dimensions.length': 5,
            'dimensions.height': 5
        });

        var s2 = new Shape('s1');
        s2.updateAttributes({
            'dimensions.width': 10,
            'dimensions.length': 10,
            'dimensions.height': 10
        });

        container.add(s1);
        container.add(s2);

        var origin = new Point(0, 0);
        container.draw(origin, 0);
        var spatialNodes = container.getSpatialInformation();

        expect(spatialNodes.length).toBe(2);
        expect(spatialNodes[0].position.x).toBe(-5);
        expect(spatialNodes[0].position.y).toBe(-2.5);

        expect(spatialNodes[1].position.x).toBe(2.5);
        expect(spatialNodes[1].position.y).toBe(0);
    });

    it('puts elements on top of each other, but mirrored on x axis', function () {
        /*       |----|
         *       | 2  |
         *       |----|
         * |----------|
         * |          |
         * |     1    |
         * |          |
         * |----------|
         */

        var container = new RowContainer('test', true);

        var s1 = new Shape('s1');
        s1.updateAttributes({
            'dimensions.width': 5,
            'dimensions.length': 5,
            'dimensions.height': 5
        });

        var s2 = new Shape('s2');
        s2.updateAttributes({
            'dimensions.width': 10,
            'dimensions.length': 10,
            'dimensions.height': 10
        });

        container.add(s1);
        container.add(s2);

        var origin = new Point(0, 0);
        container.draw(origin, 0);
        var spatialNodes = container.getSpatialInformation();

        expect(spatialNodes.length).toBe(2);
        expect(spatialNodes[0].position.x).toBe(-5);
        expect(spatialNodes[0].position.y).toBe(2.5);

        expect(spatialNodes[1].position.x).toBe(2.5);
        expect(spatialNodes[1].position.y).toBe(0);
    });
});

describe("GridContainer", function () {
    it('stacks elements', function () {
        /*
         *  |---|   |----------|
         *  | 3 |   |          |
         *  |---|   |          |
         *  |-----| |    2     |
         *  |  1  | |          |
         *  |-----| |----------|
         */

        var container = new GridContainer('test');

        var s1 = new Shape('s1');
        s1.updateAttributes({
            'dimensions.width': 5,
            'dimensions.length': 5,
            'dimensions.height': 5
        });

        var s2 = new Shape('s2');
        s2.updateAttributes({
            'dimensions.width': 10,
            'dimensions.length': 10,
            'dimensions.height': 10
        });

        var s3 = new Shape('s3');
        s3.updateAttributes({
            'dimensions.width': 2,
            'dimensions.length': 4,
            'dimensions.height': 2
        });

        container.add(s1);
        container.add(s2);
        container.add(s3);

        var origin = new Point(0, 0);
        container.draw(origin, 0);
        var spatialNodes = container.getSpatialInformation();

        expect(spatialNodes.length).toBe(3);

        expect(spatialNodes[0].key).toBe('s1');
        expect(spatialNodes[0].position.x).toBe(-2.5);
        expect(spatialNodes[0].position.y).toBe(-5);

        expect(spatialNodes[2].key).toBe('s2');
        expect(spatialNodes[2].position.x).toBe(0);
        expect(spatialNodes[2].position.y).toBe(2.5);

        expect(spatialNodes[1].key).toBe('s3');
        expect(spatialNodes[1].position.x).toBe(2);
        expect(spatialNodes[1].position.y).toBe(-6.5);

    });

    it('stacks elements, but mirrored', function () {
        /*  |----------|  |---|
         *  |          |  | 3 |
         *  |          |  |---|
         *  |    2     ||-----|
         *  |          ||  1  |
         *  |----------||-----|
         */

        var container = new GridContainer('test', true);

        var s1 = new Shape('s1');
        s1.updateAttributes({
            'dimensions.width': 5,
            'dimensions.length': 5,
            'dimensions.height': 5
        });

        var s2 = new Shape('s2');
        s2.updateAttributes({
            'dimensions.width': 10,
            'dimensions.length': 10,
            'dimensions.height': 10
        });

        var s3 = new Shape('s3');
        s3.updateAttributes({
            'dimensions.width': 2,
            'dimensions.length': 4,
            'dimensions.height': 2
        });

        container.add(s1);
        container.add(s2);
        container.add(s3);

        var origin = new Point(0, 0);
        container.draw(origin, 0);
        var spatialNodes = container.getSpatialInformation();

        expect(spatialNodes.length).toBe(3);

        expect(spatialNodes[0].key).toBe('s1');
        expect(spatialNodes[0].position.x).toBe(-2.5);
        expect(spatialNodes[0].position.y).toBe(5);

        expect(spatialNodes[2].key).toBe('s2');
        expect(spatialNodes[2].position.x).toBe(0);
        expect(spatialNodes[2].position.y).toBe(-2.5);

        expect(spatialNodes[1].key).toBe('s3');
        expect(spatialNodes[1].position.x).toBe(2);
        expect(spatialNodes[1].position.y).toBe(6.5);
    });
});

describe("LightmapContainer", function () {
    it('stacks multiple elements', function () {
        /* |--------|
         * |        | |------|
         * |    2   | |   3  |
         * |--------| |------|
         * |---------------------------|
         * |        1                  |
         * |---------------------------|
         */

        var container = new LightmapContainer('test');

        var s1 = new Shape('s1');
        s1.updateAttributes({
            'dimensions.width': 15,
            'dimensions.length': 6,
            'dimensions.height': 6
        });

        var s2 = new Shape('s2');
        s2.updateAttributes({
            'dimensions.width': 5,
            'dimensions.length': 5,
            'dimensions.height': 5
        });

        var s3 = new Shape('s3');
        s3.updateAttributes({
            'dimensions.width': 4,
            'dimensions.length': 4,
            'dimensions.height': 4
        });

        container.add(s1);
        container.add(s2);
        container.add(s3);

        var origin = new Point(0, 0);
        container.draw(origin, 0);
        var spatialNodes = container.getSpatialInformation();

        expect(spatialNodes.length).toBe(3);


        expect(spatialNodes[0].key).toBe('s1');
        expect(spatialNodes[0].position.x).toBe(-2.5);
        expect(spatialNodes[0].position.y).toBe(0);

        expect(spatialNodes[1].key).toBe('s2');
        expect(spatialNodes[1].position.x).toBe(3);
        expect(spatialNodes[1].position.y).toBe(-5);

        expect(spatialNodes[2].key).toBe('s3');
        expect(spatialNodes[2].position.x).toBe(2.5);
        expect(spatialNodes[2].position.y).toBe(-0.5);
    });

    it('stacks multiple elements, but mirrored', function () {
        /*                    |--------|
         *           |------| |        |
         *           |   3  | |    2   |
         *           |------| |--------|
         * |---------------------------|
         * |            1              |
         * |---------------------------|
         */

        var container = new LightmapContainer('test', true);

        var s1 = new Shape('s1');
        s1.updateAttributes({
            'dimensions.width': 15,
            'dimensions.length': 6,
            'dimensions.height': 6
        });

        var s2 = new Shape('s2');
        s2.updateAttributes({
            'dimensions.width': 5,
            'dimensions.length': 5,
            'dimensions.height': 5
        });

        var s3 = new Shape('s3');
        s3.updateAttributes({
            'dimensions.width': 4,
            'dimensions.length': 4,
            'dimensions.height': 4
        });

        container.add(s1);
        container.add(s2);
        container.add(s3);

        var origin = new Point(0, 0);
        container.draw(origin, 0);
        var spatialNodes = container.getSpatialInformation();

        expect(spatialNodes.length).toBe(3);


        expect(spatialNodes[0].key).toBe('s1');
        expect(spatialNodes[0].position.x).toBe(-2.5);
        expect(spatialNodes[0].position.y).toBe(0);

        expect(spatialNodes[1].key).toBe('s2');
        expect(spatialNodes[1].position.x).toBe(3);
        expect(spatialNodes[1].position.y).toBe(5);

        expect(spatialNodes[2].key).toBe('s3');
        expect(spatialNodes[2].position.x).toBe(2.5);
        expect(spatialNodes[2].position.y).toBe(0.5);
    });
});
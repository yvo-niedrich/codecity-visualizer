var Version = require('../../lib/model/components/version');

describe("Versions", function() {
    it('is distinguishable', function () {
        const v1 = new Version('k1', 'v1');
        const v2 = new Version('k2', 'v1');

        expect(v1 == v2).not.toBeTruthy();
        expect(v1).not.toEqual(v2);
    });

    it('is sortable', function () {
        const v1 = new Version('k1', 'v1', 0);
        const v2 = new Version('k2', 'v2', 24);

        expect(v1 < v2).toBeTruthy();
        expect(v1 > v2).toBeFalsy();
    });
});
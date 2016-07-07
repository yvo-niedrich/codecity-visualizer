var CCV = require('../../app');
var Dependency = CCV.components.dependency;
var TreeNode = CCV.components.node;

describe("Dependency", function() {
    it("sets Source and Target as expected", function() {
        const n1 = new TreeNode('Classname 1');
        const n2 = new TreeNode('Classname 2');
        const d = new Dependency(n1, n2);

        expect(d.source).toBe(n1);
        expect(d.target).toBe(n2);

        expect(d.source).not.toBe(n2);
        expect(d.target).not.toBe(n1);
    });

    it("keeps the type", function() {
        const n1 = new TreeNode('Classname 1');
        const n2 = new TreeNode('Classname 2');
        const d = new Dependency(n1, n2);

        expect(d.source).not.toBe('Classname 1');
        expect(d.target).not.toBe('Classname 2');
    });
});
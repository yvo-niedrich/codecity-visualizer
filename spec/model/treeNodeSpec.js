var CCV = require('../../app');
var TreeNode = CCV.components.node;

describe("TreeNode", function() {

    it('converts key to a string', function() {
        const root = new TreeNode('root');

        expect(root == 'root').toBeTruthy();
        expect(root).not.toBe("root");
        expect(root).not.toEqual("root");
    });


    it('behaves like a tree', function () {
        const root = new TreeNode('root');
        const firstChild = new TreeNode('1');

        firstChild.add('1.1');
        firstChild.add('1.2');
        firstChild.add('1.3');

        root.add(firstChild);
        root.add(new TreeNode('2'));

        expect(root.children.length).toBe(2);
        expect(firstChild.children.length).toBe(3);
        expect(firstChild).toBe(root.children[0]);
        expect(root.children[1]).not.toBe(firstChild);
        expect(root.children[1].children.length).toBe(0);
    });
});
var CCV = require('../../app');
var AttributeHelper = CCV.helper.attributes;
var TreeNode = CCV.components.node;

describe("AttributeHelper", function() {
    var model = new CCV.models.dummy();
    var versions = model.getVersions();
    var tree = model.getTree();

    var v1Node = tree.find("baboon");
    var v2Node = tree.find("lybica");
    var unavailableNode = new TreeNode("cthulhu");

    it("will throw errors for require", function() {
        expect(function() { AttributeHelper.require(model, v2Node, versions[0]); }).toThrow();
        expect(function() { AttributeHelper.require(model, unavailableNode, versions[0]); }).toThrow();
        expect(function() { AttributeHelper.require(model, unavailableNode, versions[1]); }).toThrow();
    });

    it("will not throw errors for available required elements", function() {
        expect(function() { AttributeHelper.require(model, v1Node, versions[0]); }).not.toThrow();
        expect(function() { AttributeHelper.require(model, v1Node, versions[1]); }).not.toThrow();
        expect(function() { AttributeHelper.require(model, v2Node, versions[1]); }).not.toThrow();
    });

    it("will throw errors for required attributes", function() {
        expect(function() { AttributeHelper.require(model, v2Node, versions[0], "name"); }).toThrow();
        expect(function() { AttributeHelper.require(model, v1Node, versions[0], "invalid"); }).toThrow();
        expect(function() { AttributeHelper.require(model, unavailableNode, versions[1], "name"); }).toThrow();
    });

    it("will not throw errors for required existing attributes", function() {
        expect(function() { AttributeHelper.require(model, v1Node, versions[0], "loc"); }).not.toThrow();
        expect(function() { AttributeHelper.require(model, v1Node, versions[0], "name"); }).not.toThrow();
        expect(function() { AttributeHelper.require(model, v2Node, versions[1], "name"); }).not.toThrow();
    });

    it("acquire attributes with fallback strategies", function() {
        expect(AttributeHelper.attrFallbackFirstAvailable(model, v2Node, versions[1]).name).toBe("lybica");
        expect(AttributeHelper.attrFallbackFirstAvailable(model, v2Node, versions[0]).name).toBe("lybica");
        expect(AttributeHelper.attrFallbackFirstAvailableSuccessor(model, v2Node, versions[0]).name).toBe("lybica");
        expect(AttributeHelper.attrFallbackSweep(model, v2Node, versions[0]).name).toBe("lybica");
        expect(AttributeHelper.attrFirstAvailableVersion(model, v1Node).name).toBe("baboon");
        expect(AttributeHelper.attrFirstAvailableVersion(model, v2Node).name).toBe("lybica");
    });

    it("will throw errors if the fallback fails", function() {
        expect(function() {AttributeHelper.attrFallbackFirstAvailable(model, unavailableNode, versions[0]);}).toThrow();
        expect(function() {AttributeHelper.attrFallbackFirstAvailable(model, unavailableNode, versions[1]);}).toThrow();
        expect(function() {AttributeHelper.attrFallbackFirstAvailablePredecessor(model, unavailableNode, versions[1]);}).toThrow();
        expect(function() {AttributeHelper.attrFallbackFirstAvailableSuccessor(model, unavailableNode, versions[1]);}).toThrow();
        expect(function() {AttributeHelper.attrFallbackFirstAvailablePredecessor(model, v2Node, versions[0]);}).toThrow();
        expect(function() {AttributeHelper.attrFallbackSweep(model, unavailableNode, versions[1]);}).toThrow();
        expect(function() {AttributeHelper.attrFirstAvailableVersion(model, unavailableNode);}).toThrow();
    });
});

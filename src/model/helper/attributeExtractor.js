class AttributeExtractor {

    /**
     * Require that node exists in version. Optionally an attribute can be required for the node and version.
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @param {Version}  version
     * @param {String}   attribute
     * @returns {boolean}
     * @throws Exception if non-existent
     */
    static require(model, node, version, attribute = null) {
        if (model.exists(node, version)) {
            if(attribute !== null && !(attribute in model.attributes(node, version))) {
                throw 'Attribute ' + attribute + ' does not exist in Version ' + version + ' for Node ' + node;
            }

            return true;
        }

        throw 'Node ' + node + ' does not exist in Version ' + version;
    }

    /**
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes if the node's first appearance
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @param {Version}  version
     * @returns {Object}
     * @throws Exception if no data is available
     */
    static attrFallbackFirstAvailable(model, node, version) {
        if (model.exists(node, version)) {
            return model.attributes(node, version);
        }

        return AttributeExtractor.attrFirstAvailableVersion(model, node);
    }

    /**
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes if the node's first appearance
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @param {Version}  version
     * @returns {Object|null}
     * @throws Exception if no data is available
     */
    static attrFallbackFirstAvailablePredecessor(model, node, version) {
        var vIndex = model.versions.indexOf(version);

        while (vIndex >= 0) {
            let v = model.versions[vIndex--];
            if (model.exists(node, v)) {
                return model.attributes(node, v);
            }
        }

        throw 'No data for Node ' + node + ' exist before Version ' + version;
    }

    /**
     * Returns the attributes of the node's first appearance
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @returns {Object}
     * @throws Exception if no data is available
     */
    static attrFirstAvailableVersion(model, node) {
        for (let v of model.versions) {
            if (model.exists(node, v)) {
                return model.attributes(node, v);
            }
        }

        throw 'No data for Node ' + node + ' exist';
    }
}

module.exports = AttributeExtractor;
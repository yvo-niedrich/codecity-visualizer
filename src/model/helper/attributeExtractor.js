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
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes of the node's
     * first appearance
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
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes of the node's
     * first appearance on a preceding version
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @param {Version}  version
     * @returns {Object|null}
     * @throws Exception if no data is available in range
     */
    static attrFallbackFirstAvailablePredecessor(model, node, version) {
        let vIndex = model.versions.indexOf(version);

        while (vIndex >= 0) {
            const v = model.versions[vIndex--];
            if (model.exists(node, v)) {
                return model.attributes(node, v);
            }
        }

        throw 'No data for Node ' + node + ' existing before Version ' + version;
    }

    /**
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes if the node's
     * first appearance on a succeeding version
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @param {Version}  version
     * @returns {Object|null}
     * @throws Exception if no data is available in range
     */
    static attrFallbackFirstAvailableSuccessor(model, node, version) {
        let vIndex = model.versions.indexOf(version);
        let versions = model.versions.length;

        while (vIndex < versions) {
            const v = model.versions[vIndex++];
            if (model.exists(node, v)) {
                return model.attributes(node, v);
            }
        }

        throw 'No data for Node ' + node + ' existing after Version ' + version;
    }


    /**
     * Returns the attributes for the Node in the Version. If it does not exist, try the if the node's preceding
     * versions, then the succeeding versions.
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @param {Version}  version
     * @returns {Object|null}
     * @throws Exception if no data is available
     */
    static attrFallbackSweep(model, node, version) {
        try {
            return AttributeExtractor.attrFallbackFirstAvailablePredecessor(model, node, version);
        } catch (err) {
            // No Data available before version
        }

        try {
            return AttributeExtractor.attrFallbackFirstAvailableSuccessor(model, node, version);
        } catch (err) {
            // No Data available after version
        }

        throw 'No data for Node ' + node + ' existing';
    }


    /**
     * Returns the attributes of the node's first appearance
     * @param {BaseSoftwareModel} model
     * @param {TreeNode} node
     * @returns {Object}
     * @throws Exception if no data is available
     */
    static attrFirstAvailableVersion(model, node) {
        for (const v of model.versions) {
            if (model.exists(node, v)) {
                return model.attributes(node, v);
            }
        }

        throw 'No data for Node ' + node + ' existing';
    }
}

module.exports = AttributeExtractor;
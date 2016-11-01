export class AttributeExtractor {

    /**
     * Require that node exists in version. Optionally an attribute can be required for the node and version.
     * @throws Exception if non-existent
     */
    public static require(
        model: SoftwareModel,
        node: TreeNodeInterface,
        version: VersionInterface,
        attribute: string | null = null
    ): boolean {
        if (model.exists(node, version)) {
            if (attribute !== null && !(attribute in model.getAttributes(node, version))) {
                throw "Attribute " + attribute + " does not exist in Version " + version + " for Node " + node;
            }

            return true;
        }

        throw "Node " + node + " does not exist in Version " + version;
    }

    /**
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes of the node"s
     * first appearance
     * @throws Exception if no data is available
     */
    public static attrFallbackFirstAvailable(
        model: SoftwareModel,
        node: TreeNodeInterface,
        version: VersionInterface
    ): AttributeContainer {
        if (model.exists(node, version)) {
            return model.getAttributes(node, version);
        }

        return AttributeExtractor.attrFirstAvailableVersion(model, node);
    }

    /**
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes of the node"s
     * first appearance on a preceding version
     * @throws Exception if no data is available in range
     */
    public static attrFallbackFirstAvailablePredecessor(
        model: SoftwareModel,
        node: TreeNodeInterface,
        version: VersionInterface
    ): AttributeContainer {
        let vIndex = model.getVersions().indexOf(version);

        while (vIndex >= 0) {
            const v = model.getVersions()[vIndex--];
            if (model.exists(node, v)) {
                return model.getAttributes(node, v);
            }
        }

        throw "No data for Node " + node + " existing before Version " + version;
    }

    /**
     * Returns the attributes for the Node in the Version. If it does not exist, get the attributes if the node"s
     * first appearance on a succeeding version
     * @throws Exception if no data is available in range
     */
    public static attrFallbackFirstAvailableSuccessor(
        model: SoftwareModel,
        node: TreeNodeInterface,
        version: VersionInterface
    ): AttributeContainer {
        let vIndex = model.getVersions().indexOf(version);
        const versions = model.getVersions().length;

        while (vIndex < versions) {
            const v = model.getVersions()[vIndex++];
            if (model.exists(node, v)) {
                return model.getAttributes(node, v);
            }
        }

        throw "No data for Node " + node + " existing after Version " + version;
    }

    /**
     * Returns the attributes for the Node in the Version. If it does not exist, try the if the node"s preceding
     * versions, then the succeeding versions.
     * @throws Exception if no data is available
     */
    public static attrFallbackSweep(
        model: SoftwareModel,
        node: TreeNodeInterface,
        version: VersionInterface
    ): AttributeContainer {
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

        throw "No data for Node " + node + " available";
    }

    /**
     * Returns the attributes of the node"s first appearance
     * @returns {Object}
     * @throws Exception if no data is available
     */
    public static attrFirstAvailableVersion(model: SoftwareModel, node: TreeNodeInterface) {
        for (const v of model.getVersions()) {
            if (model.exists(node, v)) {
                return model.getAttributes(node, v);
            }
        }

        throw "No data for Node " + node + " existing";
    }
}

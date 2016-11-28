/* tslint:disable */
import {SoftwareModel, TreeNodeInterface, VersionInterface, AttributeContainer} from "./interfaces";

export namespace appHelpers {
    export class attributes {
        public static require(
            model: SoftwareModel,
            node: TreeNodeInterface,
            version: VersionInterface,
            attribute?: string | null
        ): boolean;

        public static attrFallbackFirstAvailable(
            model: SoftwareModel,
            node: TreeNodeInterface,
            version: VersionInterface
        ): AttributeContainer;

        public static attrFallbackFirstAvailablePredecessor(
            model: SoftwareModel,
            node: TreeNodeInterface,
            version: VersionInterface
        ): AttributeContainer;

        public static attrFallbackFirstAvailableSuccessor(
            model: SoftwareModel,
            node: TreeNodeInterface,
            version: VersionInterface
        ): AttributeContainer;

        public static attrFallbackSweep(
            model: SoftwareModel,
            node: TreeNodeInterface,
            version: VersionInterface
        ): AttributeContainer;

        public static attrFirstAvailableVersion(
            model: SoftwareModel,
            node: TreeNodeInterface
        ): AttributeContainer;
    }
}

import AttributeExtractor = appHelpers.attributes;

export {
    AttributeExtractor
};

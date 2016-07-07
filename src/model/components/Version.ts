/**
 * A Software Version
 */
class Version {
    // TODO: TypeScript 2.0 -> readonly
    public key: String;
    public label: String;
    private order: Number;

    constructor(key: String, label: String, order: Number = 0) {
        this.key   = key;
        this.label = label;
        this.order = order;
    }

    /**
     * Convert Version to String (it's key)
     * @return {string}
     */
    public toString(): String {
        return this.key;
    }

    /**
     * Value of this version (for comparison)
     * @return {int}
     */
    public valueOf(): Number {
        return this.order;
    }
}

export default Version;
/**
 * A Software Version
 */
class Version implements Number {
    // TODO: TypeScript 2.0 -> readonly
    public key: string;
    public label: string;
    private order: number;

    constructor(key: string, label: string, order?: number) {
        this.key   = key;
        this.label = label;
        this.order = order ? order : 0;
    }

    /**
     * Convert Version to String (it's key)
     * @return {string}
     */
    public toString(radix?: number): string {
        return this.key;
    }

    /**
     * Value of this version (for comparison)
     * @return {int}
     */
    public valueOf(): number {
        return this.order;
    }

    public toFixed(fractionDigits?: number): string {
        // TODO
        return String(this.order);
    }

    public toExponential(fractionDigits?: number): string {
        return String(this.order);
    }

    public toPrecision(precision?: number): string {
        return String(this.order);
    }
}

export default Version;
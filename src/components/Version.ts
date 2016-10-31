export class Version implements VersionInterface {
    public readonly key: string;
    public readonly label: string;
    private order: number;

    constructor(key: string, label: string, order?: number) {
        this.key   = key;
        this.label = label;
        this.order = order ? order : 0;
    }

    /**
     * Convert Version to String (it"s key)
     * @return {string}
     */
    public toString(): string {
        return this.key;
    }

    /**
     * Value of this version (for comparison)
     * @return {int}
     */
    public valueOf(): number {
        return this.order;
    }
}

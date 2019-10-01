/**
 * Represents a list of fields and their corresponding type. Used in declaring fields.
 *
 * e.g. [foo string, bar boolean, baz IInsightFacade]
 */
export class VarList {
    nameToType: Map<string, string>;

    constructor() {
        this.nameToType = new Map();
    }

    public addPair(name: string, type: string): void {
        this.nameToType.set(name, type);
    }

    public getVars(): String[] {
        return Array.from(this.nameToType.keys());
    }
}

/**
 * Represents the paths to the types we have available in our language. It acts as a basic map from a type name
 * to its path.
 *
 * Whenever we declare a new type, we should make a new entry for it in the map.
 */
export class PathTable {

    private table: Map<string, string> = new Map();
    static instance: PathTable = null;

    private constructor() {}

    public static getInstance(): PathTable {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new PathTable();
        }
        return this.instance;
    }

    public addTypePath(typeName: string, path: string): void {
        this.table.set(typeName, path);
    }

    public getPath(typeName: string): string {
        return this.table.get(typeName);
    }
}

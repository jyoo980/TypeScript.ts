import {VarList} from "./VarList";

/**
 * Represents a field declaration in the TypeScript DSL.
 *
 * e.g. fields [bar string, baz boolean] as public
 */
export class FieldDecl {

    fields: VarList;
    visibility: string;

    constructor() {
        this.fields = new VarList();
    }

    public addField(fieldName: string, fieldType: string): void {
        this.fields.addPair(fieldName, fieldType);
    }

    public setVisibility(modifier: string): void {
        this.visibility = modifier;
    }
}

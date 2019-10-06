import { TypeTable } from "./symbols/TypeTable";
import {Tokenizer} from "../util/Tokenizer";

export abstract class AstNode {

    protected typeTable: TypeTable = TypeTable.getInstance();
    protected tokenizer: Tokenizer = Tokenizer.getInstance();

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract parse(): any;

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract evaluate(): any;

    /**
     * Converts indentation token string to numerical value
     *
     * @param indentString  indentation token string with format _INDENT_LEVEL=[0-9]+_
     * @returns number      extracted from indentation token
     */
    public extractTabLevel(indentString: string): number {
        return parseInt(indentString.replace(/\D/g, ''));
    }
}

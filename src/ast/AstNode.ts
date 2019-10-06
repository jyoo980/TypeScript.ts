import { TypeTable } from "./symbols/TypeTable";
import {Tokenizer} from "../util/Tokenizer";

export abstract class AstNode {

    protected typeTable: TypeTable = TypeTable.getInstance();
    protected tokenizer: Tokenizer = Tokenizer.getInstance();

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract parse(): any;

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract evaluate(): any;
}

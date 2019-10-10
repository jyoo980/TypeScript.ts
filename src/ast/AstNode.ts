import { TypeTable } from "./symbols/TypeTable";
import {Tokenizer} from "../util/Tokenizer";
import FileSystem from "../util/FileSystem";

export abstract class AstNode {

    protected typeTable: TypeTable = TypeTable.getInstance();
    protected fileSystem: FileSystem  = new FileSystem();

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract parse(context: Tokenizer): any;

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract evaluate(): any;
}

import { TypeTable } from "./symbols/TypeTable";
import {Tokenizer} from "../util/Tokenizer";
import TypeScriptEngine from "../codegen/TypeScriptEngine";
import PrintUtil from "../util/PrintUtil";
import ts = require("typescript");

export abstract class AstNode {

    protected typeTable: TypeTable = TypeTable.getInstance();
    protected engine: TypeScriptEngine = new TypeScriptEngine();
    protected printer: PrintUtil = new PrintUtil(ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }));

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract parse(context: Tokenizer): any;

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract evaluate(): any;
}

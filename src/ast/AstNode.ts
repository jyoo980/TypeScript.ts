import { TypeTable } from "./symbols/TypeTable";
import {Tokenizer} from "../util/Tokenizer";
import FileSystem from "../util/FileSystem";
import TypeScriptEngine from "../codegen/TypeScriptEngine";
import PrintUtil from "../util/PrintUtil";
import ts = require("typescript");
import {PathTable} from "../util/PathTable";
import Visitor from "../codegen/Visitor";

export abstract class AstNode {

    protected typeTable: TypeTable = TypeTable.getInstance();
    protected pathTable: PathTable = PathTable.getInstance();
    protected fileSystem: FileSystem  = new FileSystem();
    protected engine: TypeScriptEngine = new TypeScriptEngine();
    protected printer: PrintUtil = new PrintUtil(ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }));

    public abstract parse(context: Tokenizer): any;

    public abstract evaluate(): any;

    public abstract accept(v: Visitor): void;
}

import { TypeTable } from "./symbols/TypeTable";
import {Tokenizer} from "../util/Tokenizer";
import FileSystem from "../util/FileSystem";
import TypeScriptEngine from "../codegen/TypeScriptEngine";
import PrintUtil from "../util/PrintUtil";
import ts = require("typescript");
import {PathTable} from "../util/PathTable";
import IVisitor from "../visitor/IVisitor";

export abstract class AstNode {

    protected typeTable: TypeTable = TypeTable.getInstance();
    protected pathTable: PathTable = PathTable.getInstance();
    protected fileSystem: FileSystem  = new FileSystem();
    protected engine: TypeScriptEngine = new TypeScriptEngine();
    protected printer: PrintUtil = new PrintUtil(ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }));

    public abstract parse(context: Tokenizer): any;

    public abstract evaluate(): any;

    public abstract typeCheck(): void;

    /**
     * This should be run after typeCheck() to modify the AST nodes such that they correctly
     * fulfill extends/implements contracts, i.e.
     *  - classes which implement an interface should have the correct method signatures
     *  - interfaces which extend other interfaces should have the correct method signatures
     */
    public abstract fulfillContract(): void;

    abstract accept(v: IVisitor): void;
}

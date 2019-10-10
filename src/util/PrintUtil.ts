import { Printer, SourceFile } from "typescript";
import ts = require("typescript");

export default class PrintUtil {

    private readonly printer: Printer;
    private readonly file: SourceFile;

    constructor(printer: Printer) {
        this.printer = printer;
        this.file = ts.createSourceFile(
            "TypeScript.ts",
            "",
            ts.ScriptTarget.Latest,
            /*setParentNodes*/ false,
            ts.ScriptKind.TS
        );
    }

    /**
     * Given an TypeScript API AST node, return the string representation of it.
     * @param tsNode the node which we want to print.
     */
    public tsNodeToString(tsNode: ts.Node): string {
        return this.printer.printNode(
            ts.EmitHint.Unspecified,
            tsNode,
            this.file
        );
    }
}

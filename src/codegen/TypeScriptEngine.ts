import * as ts from "typescript";
import { Printer, FunctionDeclaration, ParameterDeclaration, TypeNode } from "typescript";
import {VarList} from "../ast/VarList";
import {TypeTable} from "../ast/symbols/TypeTable";

export default class TypeScriptEngine {

    private readonly printer: Printer;
    private readonly typeTable: TypeTable;

    constructor() {
        this.printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        this.typeTable = TypeTable.getInstance();
    }

    public createFun(name: string, modifiers: string[], params: VarList, returnType: string): string {
        // TODO: modifiers.
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(returnType);
        return "";
    }

    // TODO: create class method.

    // TODO: create interface method.

    private varsToParamDecl(vars: VarList): ParameterDeclaration[] {
        const params: ParameterDeclaration[] = [];
        for (const nameTypePair of Array.from(vars.nameToType)) {
            params.push(this.makeParamDecl(nameTypePair[0], nameTypePair[1]));
        }
        return params;
    }

    private makeParamDecl(name: string, type: string): ParameterDeclaration {
        return ts.createParameter(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* dotDotToken */ undefined,
            name,
            /* questionToken */ undefined,
            this.typeTable.getTypeNode(type)
        );
    }
}

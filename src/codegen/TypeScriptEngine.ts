import * as ts from "typescript";
import { Printer, FunctionDeclaration, ParameterDeclaration } from "typescript";
import {VarList} from "../ast/VarList";

export default class TypeScriptEngine {

    private readonly printer: Printer;

    constructor() {
        this.printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    }

    public createFun(name: string, modifiers: string[], params: VarList, returnType: string): string {
        // TODO: implement this
        return "";
    }

    private toParamDecl(vars: VarList): ParameterDeclaration[] {
        const params: ParameterDeclaration[] = [];
        for (const nameTypePair of Object.entries(vars.nameToType)) {
        }
        return  params;
    }

    private paramDecl(name: string, type: string): ParameterDeclaration {
        return ts.createParameter(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* dotDotToken */ undefined,
            name,
            /* questionToken */ undefined,
            // TODO: need to differentiate bt. primitives/non-primitives
            ts.createTypeReferenceNode(type, undefined)
        )
    }



}

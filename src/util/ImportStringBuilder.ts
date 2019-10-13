import {ClassDecl} from "../ast/ClassDecl";
import {PathTable} from "./PathTable";
import {VarList} from "../ast/VarList";
import {AstNode} from "../ast/AstNode";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import FuncDecl from "../ast/FuncDecl";
import {FieldDecl} from "../ast/FieldDecl";

export class ImportStringBuilder {

    /**
     * Extracts the non primitive types used by a class/interface declaration then
     * returns a series of import strings to be located at the top of a class/interface declaration.
     *
     * e.g. import {VarList} from "../ast/VarList";
     *      import {PathTable} from "./PathTable";
     *      import {ClassDecl} from "../ast/ClassDecl";
     *
     * @param node              the class/interface declaration doing the importing
     */
    public static getImportsString(node: AstNode): string {
        if (node instanceof ClassDecl) {
            return this.getClassImportsString(node);
        } else if (node instanceof InterfaceDecl) {
            return this.getInterfaceImportsString(node);
        } else {
            const msg: string = `Given node: ${node} cannot have imports string`;
            console.warn(msg);
            throw new Error(msg);
        }
    }

    /**
     * Extracts the non primitive types used by a class declaration then
     * returns a series of import strings to be located at the top of a class declaration.
     *
     * e.g. import {VarList} from "../ast/VarList";
     *      import {PathTable} from "./PathTable";
     *      import {ClassDecl} from "../ast/ClassDecl";
     *
     * @param classDec              the class declaration doing the importing
     */
    private static getClassImportsString(classDec: ClassDecl): string {
        let classNonPrimitives = this.extractNonPrimitiveTypesFromClass(classDec);
        let importStrBody: string = this.buildImportStringBody(classDec.getAbsolutePath(), classNonPrimitives);

        return importStrBody;
    }

    /**
     * Extracts the non primitive types used by a interface declaration then
     * returns a series of import strings to be located at the top of a interface declaration.
     *
     * e.g. import {VarList} from "../ast/VarList";
     *      import {PathTable} from "./PathTable";
     *      import {ClassDecl} from "../ast/ClassDecl";
     *
     * @param interfaceDec              the interface declaration doing the importing
     */
    private static getInterfaceImportsString(interfaceDec: InterfaceDecl): string {
        let interfaceNonPrimitives = this.extractNonPrimitiveTypesFromInterface(interfaceDec);
        let importStrBody: string = this.buildImportStringBody(interfaceDec.getAbsolutePath(), interfaceNonPrimitives);

        return importStrBody;
    }

    /**
     * Return series import strings to be located at the top of a class/interface declaration.
     *
     * e.g. import {VarList} from "../ast/VarList";
     *      import {PathTable} from "./PathTable";
     *      import {ClassDecl} from "../ast/ClassDecl";
     *
     * @param importerPath          path to the class/interface
     * @param nonPrimitives    the set of non primitive types used by the class/interface declaration
     */
    private static buildImportStringBody(importerPath: string, nonPrimitives: Set<string>): string {
        let pathTable = PathTable.getInstance();
        let importStrBody: string = "";

        nonPrimitives.forEach((importItem: string) => {
            let nonPrimitivePath = pathTable.getPath(importItem);
            if (nonPrimitivePath !== undefined) {
                let importStr = this.buildImportString(importItem, importerPath, nonPrimitivePath);

                importStrBody += importStr;
            }
        });
        return importStrBody;
    }

    /**
     * Return what the import string would be for an imported type in the given class' path.
     *
     * e.g. import {VarList} from "../ast/VarList";
     *
     * How to get from src path to dst path?
     * 1) Find common point between two paths
     * 2) Compute number of "cd .." commands needed to get to common point from src
     * 3) Concatenate "../" with path from common point to dst
     *
     *
     * @param nonPrimitiveName      the name of the type to be imported
     * @param classOrInterfacePath  the path to the class/interface doing the importing
     * @param nonPrimitivePath      the path to the type to be imported
     */
    private static buildImportString(nonPrimitiveName: string, classOrInterfacePath: string, nonPrimitivePath: string): string {
        let dstArr = nonPrimitivePath.split("/");
        let srcArr = classOrInterfacePath.split("/");

        let i = 0;
        while (i < srcArr.length || i < dstArr.length) {
            if (dstArr[i] !== srcArr[i]) {
                break;
            }

            i++;
        }

        let pathToDstFromCommonPoint = dstArr.slice(i);

        let importPath: string = "";

        // If in same directory, simply do a ./<NonPrimitiveParam>
        if (i === dstArr.length - 1 && i === srcArr.length - 1) {
            importPath = "./" + pathToDstFromCommonPoint.join("/");
        } else { // Need to go "up" a directory by j = (srcArr.length - 1) - i
            for (let j = srcArr.length - 1 - i; j > 0; j--) {
                importPath += "../";
            }

            importPath += pathToDstFromCommonPoint.join("/");
        }

        return `import {${nonPrimitiveName}} from \"${importPath}\";\n`;
    }

    /**
     * Extracts the non primitive types from a Class' fields, functions and inheritance
     *
     * @param classDec  the Class declaration to extract non primitives from
     */
    private static extractNonPrimitiveTypesFromClass(classDec: ClassDecl): Set<string> {
        let classNonPrimitives = new Set<string>();

        // Extract from fields
        classDec.fields.forEach((fieldDec: FieldDecl) => {
            this.extractNonPrimitiveTypesFromVarList(fieldDec.fields).forEach((nonPrimitive: string) => {
                classNonPrimitives.add(nonPrimitive);
            });
        });

        this.extractNonPrimitivesFromFunctionsAndInheritance(classDec).forEach((nonPrimitive: string) => {
            classNonPrimitives.add(nonPrimitive);
        });

        return classNonPrimitives;
    }

    /**
     * Extracts the non primitive types from a Interfaces' fields, functions and inheritance
     *
     * @param interfaceDec  the Interface declaration to extract non primitives from
     */
    private static extractNonPrimitiveTypesFromInterface(interfaceDec: InterfaceDecl): Set<string> {
        let interfaceNonPrimitives = new Set<string>();

        if (interfaceDec.fieldDecl !== undefined) {
            this.extractNonPrimitiveTypesFromVarList(interfaceDec.fieldDecl.fields).forEach((nonPrimitive: string) => {
                interfaceNonPrimitives.add(nonPrimitive);
            });
        }

        this.extractNonPrimitivesFromFunctionsAndInheritance(interfaceDec).forEach((nonPrimitive: string) => {
            interfaceNonPrimitives.add(nonPrimitive);
        });

        return interfaceNonPrimitives;
    }

    /**
     * Extracts the non primitive types from a function declaration (params and return type) and inheritance
     *
     * @param decl  Either the ClassDecl or InterfaceDecl to extract non primitives used in their functions and inheritance
     */
    private static extractNonPrimitivesFromFunctionsAndInheritance(decl: ClassDecl | InterfaceDecl): Set<string> {
        let nonPrimitives = new Set<string>();

        this.extractNonPrimitiveTypesFromFunctions(decl).forEach((nonPrimitive: string) => {
            nonPrimitives.add(nonPrimitive);
        });

        this.extractNonPrimitiveTypeFromInheritance(decl).forEach((nonPrimitive: string) => {
            nonPrimitives.add(nonPrimitive)
        });

        return nonPrimitives;
    }

    /**
     * Extracts the non primitive types from a function declaration (params and return type)
     *
     * @param decl  Either the ClassDecl or InterfaceDecl to extract non primitives used in their functions
     */
    private static extractNonPrimitiveTypesFromFunctions(decl: ClassDecl | InterfaceDecl): Set<string> {
        let nonPrimitiveTypes = new Set<string>();

        decl.functions.forEach((funcDec: FuncDecl) => {
            let nonPrimitivesParams = this.extractNonPrimitiveTypesFromVarList(funcDec.params);
            nonPrimitivesParams.forEach((nonPrimitive: string) => {
                nonPrimitiveTypes.add(nonPrimitive);
            });

            let nonPrimitiveReturnType = funcDec.returnDecl.returnType;
            if (nonPrimitiveReturnType !== "void") {
                nonPrimitiveTypes.add(nonPrimitiveReturnType);
            }
        });

        return nonPrimitiveTypes;
    }

    /**
     * Extracts the non primitive types from extends relationships and implements relationships (if applicable)
     *
     * @param decl  Either the ClassDecl or InterfaceDecl to extract non primitives used in inheritance
     */
    private static extractNonPrimitiveTypeFromInheritance(decl: ClassDecl | InterfaceDecl): Set<string> {
        let nonPrimitiveTypes = new Set<string>();

        if (decl.extendsNodes !== undefined) {
            nonPrimitiveTypes.add(decl.extendsNodes.parentName);
        }

        if (decl instanceof ClassDecl && decl.implementsNodes !== undefined) {
            decl.implementsNodes.parentNames.forEach((parentName: string) => {
                nonPrimitiveTypes.add(parentName);
            });
        }

        return nonPrimitiveTypes;
    }

    /**
     * Extracts the non primitive types from a VarList type map
     *
     * @param varList  the VarList to extract fields from
     */
    public static extractNonPrimitiveTypesFromVarList(varList: VarList): Set<string> {
        let nonPrimitiveTypes = new Set<string>();

        varList.nameTypeMap.forEach((value: string) => {
            nonPrimitiveTypes.add(value);
        });

        return nonPrimitiveTypes;
    }
}

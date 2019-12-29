import Visitor from "./Visitor";
import NodeTable from "../ast/symbols/NodeTable";
import {ClassDecl} from "../ast/ClassDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import {DirDecl} from "../ast/DirDecl";
import {AstNode} from "../ast/AstNode";
import {FieldDecl} from "../ast/FieldDecl";
import {VarList} from "../ast/VarList";

export default class InheritanceVisitor extends Visitor {

    private nodeTable: NodeTable = NodeTable.getInstance();

    public visitClassDecl(node: ClassDecl): void {
        if (node.implementsNodes !== undefined) {
            const interfacesToImplement: string[] = node.implementsNodes.parentNames;
            interfacesToImplement.forEach((parentName) => {
                const interfaceDecl: InterfaceDecl = this.nodeTable.getNode(parentName) as InterfaceDecl;
                this.implementInterface(node, interfaceDecl);
            });
        }
    }

    public visitDirDecl(node: DirDecl): void {
        node.contents.forEach((content: AstNode) => content.accept(this));
    }

    public visitInterfaceDecl(node: InterfaceDecl): void {
        if (node.extendsNodes !== undefined) {
            const parentName: string = node.extendsNodes.parentName;
            const parentNode: InterfaceDecl = this.nodeTable.getNode(parentName) as InterfaceDecl;
            this.addParentFunctions(node, parentNode);
            this.addParentFields(node, parentNode);
        }
    }

    private implementInterface(implementor: ClassDecl, toImplement: InterfaceDecl): void {
        implementor.functions = implementor.functions.concat(toImplement.functions);
        if (toImplement.fieldDecl !== undefined) {
            implementor.fields.push(toImplement.fieldDecl);
        }
    }

    private addParentFunctions(childNode: InterfaceDecl, parentNode: InterfaceDecl): void {
        childNode.functions = childNode.functions.concat(parentNode.functions);
    }

    private addParentFields(childNode: InterfaceDecl, parentNode: InterfaceDecl): void {
        if (parentNode.fieldDecl !== undefined) {
            if (childNode.fieldDecl === undefined) {
                childNode.fieldDecl = new FieldDecl();
                childNode.fieldDecl.fields = new VarList();
            }
            childNode.fieldDecl.fields.appendVarList(parentNode.fieldDecl.fields);
        }
    }
}

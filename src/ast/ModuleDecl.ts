/**
 * Represents the dependencies a TypeScript project may have. Development dependencies by default.
 *
 * e.g. modules ["chai: 4.1.2", "mocha"]
 */
import { AstNode } from "./AstNode";
import { Tokenizer } from "../util/Tokenizer";
import PackageJson from "../util/PackageJson";
import IVisitor from "../visitor/IVisitor";

export class ModuleDecl extends AstNode {

    modules: string[] = [];
    projectName: string = '';
    path: string = '';

    public parse(context: Tokenizer): any {
        if (!context.checkToken('modules')) {
            throw new Error('Expected modules keyword');
        };
        context.getNext();

        const currentLevel = context.getCurrentLineTabLevel();
        context.getAndCheckNext('\\[');
        while (!context.checkToken('\\]')) {
            if (currentLevel && currentLevel > context.getCurrentLineTabLevel()) {
                throw new Error('Bad indent');
            }

            context.getAndCheckNext("\"");
            this.modules.push(context.getNext());
            context.getAndCheckNext("\"");
            if (!context.checkToken(",")) {
                break;
            }
            context.getAndCheckNext(",");
        }
        context.getAndCheckNext('\\]');
    }

    public evaluate(): Promise<any> {
        const packageJson: PackageJson = new PackageJson(this.path, this.projectName);
        return packageJson.addModules(this.modules);
    }

    public typeCheck(): void {
        // Not needed.
    }

    public fulfillContract(): void {
        // Not needed.
    }

    public setProjectName(name: string) {
        this.projectName = name;
    }

    public setPath(path: string) {
        this.path = path;
    }

    public accept(v: IVisitor): void {
        v.visit(this);
    }
}

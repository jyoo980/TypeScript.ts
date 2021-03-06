/**
 * Represents the directories a TypeScript project may have.
 *
 * e.g. dir str (DIR | CLASS| INTERFACE)+
 */
import {Content} from "./Content";
import {Tokenizer} from "../util/Tokenizer";
import {ClassDecl} from "./ClassDecl";
import {InterfaceDecl} from "./InterfaceDecl";
import {AstNode} from "./AstNode";
import Visitor from "../codegen/Visitor";

export class DirDecl extends Content {
    directoryName: string;

    // The contents of this directory
    contents: Content[];

    tabLevel: number;

    public parse(context: Tokenizer): any {
        this.tabLevel = context.getCurrentLineTabLevel();

        context.getAndCheckNext("dir");
        this.directoryName = context.getNext();

        this.parseContents(context);

        context.checkStartOfLine();
    }

    protected parseContents(context: Tokenizer): any {
        this.contents = [];

        while (context.getCurrentLineTabLevel() > this.tabLevel && !context.checkToken("NO_MORE_TOKENS")) {
            let contentDecl: Content;

            context.checkStartOfLine();

            if (context.checkToken("dir")) {
                contentDecl = new DirDecl(this.getAbsolutePath());
            } else if (context.checkToken("class") || context.checkToken("abstract")) {
                contentDecl = new ClassDecl(this.getAbsolutePath());
            } else if (context.checkToken("interface")) {
                contentDecl = new InterfaceDecl(this.getAbsolutePath());
            } else {
                throw new Error("Unexpected token in Dir declaration.");
            }

            contentDecl.parse(context);
            this.contents.push(contentDecl);

            context.checkStartOfLine();
        }
    }

    public getAbsolutePath(): string {
        return this.parentPath + "/" + this.directoryName;
    }

    public accept(v: Visitor): void {
        v.visitDirDecl(this);
    }
}

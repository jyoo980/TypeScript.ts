import {ModuleDecl} from "./ModuleDecl";
import {DirDecl} from "./DirDecl";
import {Tokenizer} from "../util/Tokenizer";
import * as assert from "assert";

/**
 * Represents a TypeScript project to be generated.
 *
 * Child of DirDecl since a TypeScript project is a directory with a name and modules.
 *
 * e.g. ‘project ’ (str | STRLIST) MODULE? (DIR|CLASS|INTERFACE)* nl
 */
export class ProgramDecl extends DirDecl {
    projectName: string;
    modules: ModuleDecl;

    public parse(context: Tokenizer): any {
        if (context.getCurrentLineTabLevel() != 0) {
            throw new Error("Should not have tab level greater than 0 in root program scope.");
        }

        context.getAndCheckNext("project");
        this.projectName = context.getNext();
        this.directoryName = this.projectName;

        if (context.checkToken("modules")) {
            this.modules = new ModuleDecl();
            this.modules.parse(context);
        }

        super.parseContents(context);
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}

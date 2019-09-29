/**
 * Represents the directories a TypeScript project may have.
 *
 * e.g. dirs [src/model/model, test/util]
 */
export class DirDecl {

    directories: string[];

    constructor(directories: string[]) {
        this.directories = directories;
    }
}

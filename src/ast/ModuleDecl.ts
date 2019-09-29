/**
 * Represents the dependencies a TypeScript project may have. Development dependencies by default.
 *
 * e.g. modules [@types/chai: 4.0.8, chai: 4.1.2, mocha: 4.1.0]
 */
export class ModuleDecl {

    modules: string[] = [];

    constructor(modules: string[]) {
        this.modules = modules;
    }
}

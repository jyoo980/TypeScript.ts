import { expect } from "chai";
import {Tokenizer} from "../../src/util/Tokenizer";
import {ProgramDecl} from "../../src/ast/ProgramDecl";
import {DirDecl} from "../../src/ast/DirDecl";
import * as nodeFs from "fs-extra";
import FileSystem from "../../src/util/FileSystem";

describe("ProgramDecl should have its appropriate contents", () => {
    it("Tokenizes projectstructureex and parses inside ProgramDecl", () => {
        let tokenizer: Tokenizer = new Tokenizer("programExample.txt", "./test/testFiles");
        let programDecl: ProgramDecl = new ProgramDecl(".");
        programDecl.parse(tokenizer);

        expect(programDecl.contents.length).to.equal(2);
    });
});

describe("DirDecl evaluate should write directories", () => {
    const testDir: string = "./testOutput";
    let fs: FileSystem;

    before(() => {
        fs = new FileSystem();
    });

    after(async () => {
        try {
            await nodeFs.unlink(testDir);
        } catch (err) {
            console.warn(`FileSystemSpec::cleanup failed with error: ${err}`);
        }
    });

    it("Writes directories in a DirDec", () => {
        let dirs: DirDecl[] = []

        // Establish test file structure
        let rootDir: DirDecl = new DirDecl(testDir);
        rootDir.directoryName = "root";
        dirs.push(rootDir);
        let srcDir: DirDecl = new DirDecl( testDir + "/root");
        srcDir.directoryName = "src";
        dirs.push(srcDir);
        let astDir: DirDecl = new DirDecl(testDir + "/root/src");
        astDir.directoryName = "ast";
        astDir.contents = [];
        dirs.push(astDir);
        let utilDir: DirDecl = new DirDecl(testDir + "/root/src");
        utilDir.directoryName = "util";
        utilDir.contents = [];
        dirs.push(utilDir);
        srcDir.contents = [astDir, utilDir];
        rootDir.contents = [srcDir];

        rootDir.evaluate();

        for (let dir of dirs) {
            expect(fs.pathExists(dir.getAbsolutePath()));
        }
    });
});

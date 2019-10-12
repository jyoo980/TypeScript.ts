import * as nodeFs from "fs-extra";
import FileSystem, {FileDeleteError, FileReadError} from "../../src/util/FileSystem";
import { expect } from "chai";

describe("FileSystem write/delete tests", () => {

    const testDir: string = "./codegen/test";
    const createdFiles: string[] = [];
    let fs: FileSystem;

    before(() => {
        fs = new FileSystem();
    });

    after(async () => {
        try {
            const deleteOps: Array<Promise<void>> = createdFiles.map((toDelete: string) => nodeFs.unlink(toDelete));
            await Promise.all(deleteOps);
        } catch (err) {
            console.warn(`FileSystemSpec::cleanup failed with error: ${err}`);
        }
    });

    it("should successfully write a file (one level deep, e.g. codegen/test/Foo.ts", () => {
        const file: string = "Foo";
        let result: string;
        try {
            result = fs.generateFile(file, testDir, "test");
        } catch (err) {
            result = err;
        } finally {
            expect(result).to.equal("./codegen/test/Foo.ts");
            createdFiles.push(result);
        }
    });

    it("should successfully write a file (> 1 level deep, e.g. codegen/test/src/InsightFacade.ts",  () => {
        const file: string = "InsightFacade";
        let result: string;
        try {
            result = fs.generateFile(file, "./codegen/test/src", "test");
        } catch (err) {
            result = err;
        } finally {
            expect(result).to.equal("./codegen/test/src/InsightFacade.ts");
            createdFiles.push(result);
        }
    });

    it("should successfully delete a file (one level deep, e.g. codegen/test/Bar.ts", async () => {
        const file: string = "Bar";
        let result: string;
        try {
            fs.generateFile(file, testDir, "trust the natural recursion");
            await fs.deleteFile(file, testDir);
        } catch (err) {
            expect(result).to.equal("./codegen/test/Bar.ts");
        }
    });

    it("should successfully delete a file (> 1 level deep, e.g. codegen/test/src/Alice.ts", async () => {
        const file: string = "Alice";
        let result: string;
        try {
            fs.generateFile(file, "./codegen/test/src", "this is not a test file");
            result = await fs.deleteFile(file, "./codegen/test/src");
        } catch (err) {
            result = err;
        } finally {
            expect(result).to.equal("./codegen/test/src/Alice.ts");
        }
    });
});

describe("FileSystem read tests", () => {

    const testDir: string = "./test/testFiles";
    let fs: FileSystem;

    it("should successfully read contents of a file", () => {
        fs = new FileSystem();
        let contents = fs.readFileSync("projectstructureex.txt", testDir).toString();
        expect(contents).to.equal("dir src\n" +
            "\tclass Time\n" +
            "\tdir TransitModels\n" +
            "dir tests\n");
    });

    it("should throw a FileReadError when reading contents of a file that does not exist", () => {
        fs = new FileSystem();
        expect(() => {
            fs.readFileSync("fakename.txt", testDir)
        }).to.throw(FileReadError);
    });
});

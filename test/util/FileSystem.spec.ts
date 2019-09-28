import * as nodeFs from "fs-extra";
import FileSystem from "../../src/util/FileSystem";
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
            // TODO: make logging class
        }
    });

    it("should successfully write a file (one level deep, e.g. codegen/test/Foo.ts", async () => {
        const file: string = "Foo";
        let result: string;
        try {
            result = await fs.generateFile(file, testDir, "test");
        } catch (err) {
            result = err;
        } finally {
            expect(result).to.equal("./codegen/test/Foo.ts");
            createdFiles.push(result);
        }
    });

    it("should successfully write a file (> 1 level deep, e.g. codegen/test/src/InsightFacade.ts", async () => {
        const file: string = "InsightFacade";
        let result: string;
        try {
            result = await fs.generateFile(file, "./codegen/test/src", "test");
        } catch (err) {
            result = err;
        } finally {
            expect(result).to.equal("./codegen/test/src/InsightFacade.ts");
            createdFiles.push(result);
        }
    });
});

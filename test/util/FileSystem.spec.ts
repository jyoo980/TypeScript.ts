import * as nodeFs from "fs-extra";
import FileSystem from "../../src/util/FileSystem";
import { expect } from "chai";

describe("FileSystem write/delete tests", () => {

    const testDir: string = "./test/codegen";
    let fs: FileSystem;

    before(() => {
        fs = new FileSystem(testDir);
    });

    after(async() => {
        try {
            const fileNames = await nodeFs.readdir(testDir);
            const filesToDelete: string[] = fileNames.map((name: string) => `${testDir}/${name}.ts`);
            const deleteOps: Array<Promise<void>> = filesToDelete.map((toDelete: string) => nodeFs.unlink(toDelete));
            await Promise.all(deleteOps);
        } catch (err) {
            // TODO: make logging class
        }
    });

    it("should successfully write a file (one level deep, e.g. codegen/Foo.ts", async () => {
        const file: string = "Foo";
        let result: string;
        try {
            result = await fs.generateFile(file, testDir, "test");
        } catch (err) {
            result = err;
        } finally {
            expect(result).to.equal("./test/codegen/Foo.ts");
        }
    });
});

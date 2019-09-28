import * as fs from "fs-extra";

export class FileWriteError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, FileWriteError);
    }
}

export class FileDeleteError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, FileDeleteError);
    }
}

export class FileReadError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, FileReadError);
    }
}

export default class FileSystem {

    // TODO: implement basic file IO methods.

    /**
     *
     * Resolves with the full path to the file written, else, rejects with a FileWriteError
     *
     * @param fileName  of the TypeScript file to be written, does not need to end in .ts
     * @param path      path to the directory where the file should be written
     * @param content   as string
     */
    public async generateFile(fileName: string, path: string, content: string): Promise<string> {
        const fullPath: string = this.createFullPath(fileName, path);
        try {
            await fs.ensureDir(path);
            await fs.writeFile(fullPath, content);
            return fullPath;
        } catch (err) {
            throw new FileWriteError(`FileSystem::file generation of ${fullPath} failed with error: ${err}`);
        }
    }

    // TODO: create delete method.

    private createFullPath(fileName: string, path: string): string {
        return `${path}/${fileName}.ts`;
    }
}

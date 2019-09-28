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
            const msg: string = `FileSystem::file generation of ${fullPath} failed with error: ${err}`;
            console.warn(msg);
            throw new FileWriteError(msg);
        }
    }

    /**
     * Resolves with the full path to the deleted file, else, rejects with a FileDeleteError
     *
     * @param fileName  of the TypeScript file to be deleted, does not need to end in .ts
     * @param path      path to the directory in which the file exists
     */
    public async deleteFile(fileName: string, path: string): Promise<string> {
        const fullPath: string = this.createFullPath(fileName, path);
        try {
            await fs.unlink(fullPath);
            return fullPath;
        } catch (err) {
            const msg: string = `FileSystem::deleting file: ${fullPath} failed with error: ${err}`;
            console.warn(msg);
            throw new FileDeleteError(msg);
        }
    }

    private createFullPath(fileName: string, path: string): string {
        return `${path}/${fileName}.ts`;
    }
}

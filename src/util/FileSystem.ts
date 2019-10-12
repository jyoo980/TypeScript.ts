import * as fs from "fs-extra";

export class FileReadError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, FileReadError);
    }
}

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

export class DirectoryWriteError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, DirectoryWriteError);
    }
}

export class PathExistsError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, PathExistsError);
    }
}

export default class FileSystem {

    /**
     *
     * Returns with the full path to the file written, else, throws a FileWriteError
     *
     * @param fileName  of the TypeScript file to be written, does not need to end in .ts
     * @param path      path to the directory where the file should be written
     * @param content   as string
     */
    public generateFile(fileName: string, path: string, content: string): string {
        const fullPath: string = this.createFullPath(fileName, path);
        try {
            fs.ensureDirSync(path);
            fs.writeFileSync(fullPath, content);
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

    /**
     * Reads in file contents at path/fileName synchronously, throws a FileReadError
     *
     * @param fileName  of the file to be read, must include extension
     * @param path      path to the directory in which the file exists
     */
    public readFileSync(fileName: string, path: string): Buffer {
        const fullPath: string = `${path}/${fileName}`;
        try {
            return fs.readFileSync(fullPath);
        } catch (err) {
            const msg: string = `FileSystem::reading file: ${fullPath} failed with error: ${err}`;
            console.warn(msg);
            throw new FileReadError(msg);
        }
    }

    /**
     * Returns the full path to the written directory - throws a DirectoryWriteError
     * Requires all directories in path to exist
     *
     * @param absolutePath  path of directory to be written
     */
    public writeDirectory(absolutePath: string): string {
        try {
            fs.mkdirSync(absolutePath);
            return absolutePath;
        } catch (err) {
            const msg: string = `FileSystem::making directory: ${absolutePath} failed with error: ${err}`;
            console.warn(msg);
            throw new DirectoryWriteError(msg);
        }
    }

    /**
     * Returns true if the given path exists, false otherwise - throws a PathExistsError
     *
     * @param path  path to check existence of
     */
    public pathExists(path: string): boolean {
        try {
            return fs.pathExistsSync(path);
        } catch (err) {
            const msg: string = `FileSystem::checking path exists: ${path} failed with error: ${err}`;
            console.warn(msg);
            throw new PathExistsError(msg);
        }
    }
}

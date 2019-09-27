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
     * The directory to which all files should be written to.
     */
    private readonly rootDir: string;

    constructor(rootDir: string) {
        this.rootDir = rootDir;
    }

    // TODO: implement basic file IO methods.

}

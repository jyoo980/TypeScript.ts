import npmi = require('npmi');
import writePackage = require('write-pkg');

export default class PackageJson {
    private path: string;

    /**
     * @param path  path to project
     */
    constructor(path: string, project: string) {
        this.path = path;
        this.generatePackageJson(path, project);
    }

    /**
     *
     * Add and installs an npm module
     *
     * @param module    the module to install
     * @param version   verison of the module to install
     * @return Promise  resolve if successful, reject otherwise
     */
    public addModule(module: string, version?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const options: any = {
                name: module,
                version: version ? version : undefined,
                path: this.path
            };

            npmi(options, (err: any) => {
                if (err) {
                    if (err.code === npmi.LOAD_ERR) {
                        reject(`NPM::npm failed to load when installing ${module} with: ${err.message}`);
                    } else if (err.code === npmi.INSTALL_ERR) {
                        reject(`NPM::npm failed when installing ${module} with: ${err.message}`);
                    }
                }
                resolve();
            });
        });
    }

    /**
     *
     * Adds and installs all listed npm modules
     *
     * @param modules   array of modules to install (with or without versions), ex. ["module1: 1.0.0", "module2"]
     * @return Promise  resolve if successful, reject otherwise
     */
    public addModules(modules: string[]): Promise<any> {
        const promises = modules.map(async (module: string) => {
            const info: string[] = module.split(':');
            const moduleName: string = info[0].trim();
            let moduleVersion: string = null;
            if (info.length > 1) {
                moduleVersion = info[1].trim();
            }
            await this.addModule(moduleName, moduleVersion);
        });

        return Promise.all(promises);
    }

    /**
     *
     * Generates a default package.json at path
     *
     * @param path      path to place package.json
     * @param project   name of the project
     */
    private generatePackageJson(path: string, project: string): void {
        const contents: any = {
            name: project,
            version: '1.0.0',
            description: '',
            main: 'index.js',
            scripts: {
                test: 'echo "Error: no test specified" && exit 1'
            },
            author: '',
            license: 'ISC'
        };
        writePackage.sync(path, contents);
    }
} 
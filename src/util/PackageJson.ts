import npmi = require('npmi');
import * as nodeFs from "fs-extra";

export default class PackageJson {
    private path: string;

    /**
     * @param path  path to project
     */
    constructor(path: string, project: string) {
        this.path = path;
        this.generatePackageJson(project);
    }

    /**
     *
     * Add and installs an npm module
     *
     * @param module    the module to install
     * @param version   verison of the module to install
     */
    public async addModule(module: string, version?: string): Promise<any> {
        if (!module.startsWith('@types/')) {
            await this.addTypeModule(module);
        }

        return new Promise((resolve, reject) => {
            const options: any = {
                name: module,
                version: version ? version : undefined,
                path: this.path,
                forceInstall: true
            };

            npmi(options, (err: any) => {
                if (err) {
                    if (err.code === npmi.LOAD_ERR) {
                        reject(`npm failed to load when installing ${module} with: ${err.message}`);
                    } else if (err.code === npmi.INSTALL_ERR) {
                        reject(`npm failed when installing ${module} with: ${err.message}`);
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
     * @param project   name of the project
     */
    private generatePackageJson(project: string): void {
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
        nodeFs.writeJsonSync(`${this.path}/package.json`, contents);
    }

    /**
     *
     * Checks if a type pacakge exists and if so, installs it
     *
     * @param module    name of module to check for type package
     */
    private async addTypeModule(module: string): Promise<any> {
        const typeModule: string = `@types/${module}`;
        try {
            await this.addModule(typeModule);
        } catch (err) {
            console.log(`No type package found for ${module}.`);
        }
    }
} 
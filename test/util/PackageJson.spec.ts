import PackageJson from '../../src/util/PackageJson';
import { expect } from 'chai';
import * as fs from "fs";
import * as nodeFs from "fs-extra";

describe('PackageJson generation and add modules test', function() {
    this.timeout(20000);
    const dir: string = 'packageJsonTest';

    beforeEach(() => {	
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    });

    afterEach(() => {
        nodeFs.removeSync(dir);
    });

    after(() => {
        if (fs.existsSync(dir)) {
            nodeFs.removeSync(dir);
        }
    })

    function verifiyDependency(module: string): any {
        const content: any = JSON.parse(fs.readFileSync(dir + '/package.json', 'utf-8'));
        const dependencies: any = content.dependencies;
        return dependencies && Object.keys(dependencies).indexOf(module) >= 0 ? dependencies[module] : null;
    }

    it('should add module stringz', async () => {
        const module: string = 'stringz';
        try {
            const packageJson = new PackageJson(dir, 'project');
            await packageJson.addModule(module);
        } catch (err) {
            expect.fail(err);
        } finally {
            expect(verifiyDependency(module)).to.not.equal(null);
            
        }
    });

    it('should fail to add module abcabcabcabc', async () => {
        let result: string;
        const module: string = 'abcabcabcabc';
        try {
            const packageJson = new PackageJson(dir, 'project');
            result = await packageJson.addModule(module);
        } catch (err) {
            result = err;
        } finally {
            expect(result).to.equal('npm failed when installing abcabcabcabc with: 404 Not Found - GET https://registry.yarnpkg.com/abcabcabcabc - Not found');
            expect(verifiyDependency(module)).to.equal(null);
        }
    });

    it('should add modules ["left-pad: 1.1.1", "pad"] and automatically add @types/left-pad and @types/pad', async () => {
        const modules: string[] = ['left-pad: 1.1.1', 'pad'];
        try {
            const packageJson = new PackageJson(dir, 'project');
            await packageJson.addModules(modules);
        } catch (err) {
            expect.fail(err);
        } finally {
            expect(verifiyDependency('left-pad')).to.equal('^1.1.1');
            expect(verifiyDependency('pad')).to.not.equal(null);
            expect(verifiyDependency('@types/left-pad')).to.not.equal(null);
            expect(verifiyDependency('@types/pad')).to.not.equal(null);
        }
    });
});

import * as fs from 'fs';
import * as path from 'path';

/**
 * Common controller utilities.
 */
export class Utils {

    /**
     * Makes "require()" all js files (or custom extension files) in the given directory.
     */
    static requireAll(directories: string[], extension: string = '.js'): any[] {
        let files: any[] = [];
        directories.forEach((dir: string) => {
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).forEach((file: string) => {
                    if (fs.statSync(dir + '/' + file).isDirectory()) {
                        let requiredFiles = this.requireAll([dir + '/' + file], extension);
                        requiredFiles.forEach((file: string) => files.push(file));
                    } else if (path.extname(file) === extension) {
                        files.push(require(dir + '/' + file));
                    }
                });
            }
        });
        return files;
    }

    static flattenRequiredObjects(requiredObjects: any[]): Function[] {
        return requiredObjects.reduce((allObjects, objects) => {
            return allObjects.concat(Object.keys(objects).map(key => objects[key]));
        }, []);
    }

    static merge(obj1: any, obj2: any) {
        const result: any = {};
        for (var i in obj1) {
            if ((i in obj2) && (typeof obj1[i] === 'object') && (i !== null)) {
                result[i] = Utils.merge(obj1[i], obj2[i]);
            } else {
                result[i] = obj1[i];
            }
        }
        for (i in obj2) {
            result[i] = obj2[i];
        }
        return result;
    }

}
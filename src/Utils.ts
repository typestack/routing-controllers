import * as path from "path";

/**
 * Utility functions used in the codebase.
 *
 * @internal
 */
export class Utils {

    /**
     * Loads all exported classes from the given directory.
     */
    static importClassesFromDirectories(directories: string[], formats = [".js", ".ts"]): Function[] {

        const loadFileClasses = function (exported: any, allLoaded: Function[]) {
            if (exported instanceof Function) {
                allLoaded.push(exported);
            } else if (exported instanceof Array) {
                exported.forEach((i: any) => loadFileClasses(i, allLoaded));
            } else if (exported instanceof Object || typeof exported === "object") {
                Object.keys(exported).forEach(key => loadFileClasses(exported[key], allLoaded));
            }

            return allLoaded;
        };

        const allFiles = directories.reduce((allDirs, dir) => {
            return allDirs.concat(require("glob").sync(path.normalize(dir)));
        }, [] as string[]);

        const dirs = allFiles
            .filter(file => {
                const dtsExtension = file.substring(file.length - 5, file.length);
                return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== ".d.ts";
            })
            .map(file => {
                return require(file);
            });

        return loadFileClasses(dirs, []);
    }

    /**
     * Checks if given value is a Promise-like object.
     */
    static isPromiseLike(arg: any): arg is Promise<any> {
        return arg != null && typeof arg === "object" && typeof arg.then === "function";
    }

    /**
     * Runs given callback that returns promise for each item in the given collection in order.
     * Operations executed after each other, right after previous promise being resolved.
     */
    static runInSequence<T, U>(collection: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
        const results: U[] = [];
        return collection.reduce((promise, item) => {
            return promise.then(() => {
                return callback(item);
            }).then(result => {
                results.push(result);
            });
        }, Promise.resolve()).then(() => {
            return results;
        });
    }

    /**
     * Merges two given objects.
     */
    static merge(obj1: any, obj2: any): any {
        const result: any = {};
        for (let i in obj1) {
            if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                result[i] = this.merge(obj1[i], obj2[i]);
            } else {
                result[i] = obj1[i];
            }
        }
        for (let i in obj2) {
            result[i] = obj2[i];
        }
        return result;
    }

}
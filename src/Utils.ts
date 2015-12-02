/**
 * Common controller utilities.
 */
/** @internal */
export class Utils {

    /**
     * Merges two objects.
     *
     * @param obj1 First object to be merged
     * @param obj2 Second object to be merged
     * @returns Merged object
     */
    static merge(obj1: any, obj2: any): any {
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

    /**
     * Checks if given object is possibly a Promise object.
     *
     * @param object Object to be checked
     * @returns True if given object is a possible Promise, false otherwise
     */
    static isPromise(object: any): boolean {
        return object instanceof Object &&
            object.then instanceof Function &&
            object.catch instanceof Function;
    }

}
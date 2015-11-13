/**
 * Common controller utilities.
 */
export class Utils {

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
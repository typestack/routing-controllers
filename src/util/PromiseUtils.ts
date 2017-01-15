/**
 * Utils to help to work with Promise objects.
 */
export class PromiseUtils {

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
     * Tests that arg is PromiseLike (i.e. is object and has a then method)
     */
    static isPromiseLike(arg: any): arg is Promise<any> {
        return arg != null && typeof arg === "object" && typeof arg.then === "function";
    }

}

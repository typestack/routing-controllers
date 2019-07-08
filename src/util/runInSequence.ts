/**
 * Runs given callback that returns promise for each item in the given collection in order.
 * Operations executed after each other, right after previous promise being resolved.
 */
export function runInSequence<T, U>(collection: Array<T>, callback: (item: T) => Promise<U>): Promise<Array<U>> {
    const results: Array<U> = [];
    return collection.reduce((promise, item) =>
        promise.then(() =>
            callback(item)).then(result => {
            results.push(result);
        }), Promise.resolve()).then(() =>
        results);
}

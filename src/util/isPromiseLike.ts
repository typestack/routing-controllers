/**
 * Checks if given value is a Promise-like object.
 */
export function isPromiseLike(arg: any): arg is Promise<any> {
    return arg != null && typeof arg === "object" && typeof arg.then === "function";
}
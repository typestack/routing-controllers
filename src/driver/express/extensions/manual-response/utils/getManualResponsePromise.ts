import { RESPONSE_RESULT_PROMISE } from "../consts";

/**
 * fetch the result promise from the response object
 */
export function getManualResponsePromise() {
    let resultPromise = this[RESPONSE_RESULT_PROMISE];
    if (resultPromise) {
        return resultPromise;
    }
    throw new Error(`Cannot use "manual()" unless declared with @Res({manual: true})`);
}
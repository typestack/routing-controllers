import { RESPONSE_RESULT_PROMISE } from "../consts";

/**
 * fetch the result promise from the response object
 */
export function getResponseResultPromise() {
    return this[RESPONSE_RESULT_PROMISE];
}
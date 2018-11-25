import { RESPONSE_RESULT_PROMISE } from "../consts";

/**
 * Extended response properties to allow manual response
 */
export type ResponseWithResultPromise = {
    manualResponse(): Promise<any>
    [RESPONSE_RESULT_PROMISE]: Promise<any>
};
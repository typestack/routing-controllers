import {RESPONSE_RESULT_PROMISE} from "../consts";
import {ManualResponse} from "../types/ManualResponse";

/**
 * Checks whether
 * @param response
 */
export function isManualResponse(response: ManualResponse): boolean {
    return typeof response === "object" && response[RESPONSE_RESULT_PROMISE] !== undefined;
}
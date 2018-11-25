import { RESOLVED_RESULT } from "./consts";

export function getManualResponse() {
    return this[RESOLVED_RESULT];
}
import { RESOLVED_RESULT } from "./consts";
import { ManualResponse } from "./ManualResponse";

export function isManualResponse(response: ManualResponse): boolean {
    return typeof response === "object" && response[RESOLVED_RESULT] !== undefined;
}
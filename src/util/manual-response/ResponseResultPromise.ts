import { RESOLVED_RESULT } from "./consts";

export type ResponseResultPromise = {
    manualResponse(): Promise<any>
    [RESOLVED_RESULT]: Promise<any>
};
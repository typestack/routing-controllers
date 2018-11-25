import { RESOLVED_RESULT } from "./consts";
import { getManualResponse } from "./getManualResponse";
import { ManualResponse } from "./ManualResponse";

import * as experss from "express";
(experss as any).response.manualResponse = getManualResponse;

export function enrichResponseWithEndAwareness(response: ManualResponse) {
    response[RESOLVED_RESULT] = new Promise((resolve, reject) => {
        let firstResolveCb = resolve;
        const originalEnd = response.end;
        response.end = (...args: any[]) => {
            const endResult = args[0];
            if (firstResolveCb) {
                firstResolveCb(endResult);
                // Verifies that the callback is called only once
                firstResolveCb = undefined;
            }
            // Verifies that the "end" method is called only once
            response.end = originalEnd;
            return originalEnd.apply(response, args);
        };
    });
}
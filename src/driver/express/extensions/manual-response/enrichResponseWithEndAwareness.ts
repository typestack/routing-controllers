import { RESPONSE_RESULT_PROMISE } from "./consts";
import { ManualResponse } from "./types/ManualResponse";


export function enrichResponseWithEndAwareness(response: ManualResponse) {
    if (!response[RESPONSE_RESULT_PROMISE]) {
        const resultPromise = new Promise((resolve, reject) => {
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
        response[RESPONSE_RESULT_PROMISE] = resultPromise;
    }
}
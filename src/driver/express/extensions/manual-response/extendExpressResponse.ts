import * as experss from "express";
import { getResponseResultPromise } from "./utils/getResponseResultPromise";

/**
 * Adds "response.manualResponse()" functionallity to set the response manually and allow further middlewares to functionate appropriately
 */
export function extendExpressResponse() {
    (experss as any).response.manualResponse = getResponseResultPromise;
}

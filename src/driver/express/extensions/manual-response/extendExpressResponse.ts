import * as experss from "express";
import {getManualResponsePromise} from "./utils/getManualResponsePromise";

/**
 * Adds "response.manual()" functionality to set the response manually and allow further middlewares to functionate appropriately
 */
export function extendExpressResponse() {
    (experss as any).response.manual = getManualResponsePromise;
}

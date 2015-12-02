import {ResponseInterceptorInterface} from "./ResponseInterceptorInterface";
import {ResultHandleOptions} from "../ResultHandleOptions";

/**
 * Classes that intercepts response result must implement this interface.
 */
export class InterceptorHelper {

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    callInterceptors(options: ResultHandleOptions): any {
        if (!options.interceptors || !options.interceptors.length)
            return options.content;

        return options.asJson ? this.callJsonInterceptors(options) : this.callSendInterceptors(options);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private callSendInterceptors(options: ResultHandleOptions): any {
        return options.interceptors
            .filter(inter => !!inter.onSend)
            .reduce((value, inter) => inter.onSend(value, options.request, options.response), options.content);
    }

    private callJsonInterceptors(options: ResultHandleOptions): any {
        return options.interceptors
            .filter(inter => !!inter.onJson)
            .reduce((value, inter) => inter.onJson(value, options.request, options.response), options.content);
    }

}
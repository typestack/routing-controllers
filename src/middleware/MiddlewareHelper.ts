import {ResultHandleOptions} from "../ResultHandleOptions";

/**
 * Classes that intercepts response result must implement this interface.
 */
export class MiddlewareHelper {

    callInterceptors(options: ResultHandleOptions): any { // todo:
        return options
            .interceptors
            .reduce((value, inter) => inter.use(value, options.request, options.response), options.content);
    }
    
}
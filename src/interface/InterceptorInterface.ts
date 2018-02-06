import {Action} from "../Action";

/**
 * Classes that intercepts response result must implement this interface.
 */
export interface InterceptorInterface {

    /**
     * Called before success response is being sent to the request.
     * Returned result will be sent to the user.
     */
    intercept(action: Action, result: any): any|Promise<any>;

}
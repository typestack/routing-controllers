import {ServerResponse, IncomingMessage} from "http";

/**
 * Classes that intercepts response result must implement this interface.
 */
export interface ErrorMiddlewareInterface {

    /**
     * Called before response.send is being called. The data passed to method is the data passed to .send method.
     * Note that you must return same (or changed) data and it will be passed to .send method.
     */
    error(error: any, request: IncomingMessage, response: ServerResponse, next: (err?: any) => any): void;

}
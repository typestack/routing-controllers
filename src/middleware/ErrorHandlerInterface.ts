import {ServerResponse} from "http";
import {IncomingMessage} from "http";

/**
 * Classes that intercepts response result must implement this interface.
 */
export interface ErrorHandlerInterface {

    /**
     * Called before controller action is being executed.
     */
    error(error: any, request: IncomingMessage, response: ServerResponse, next: Function): void;

}
import {ServerResponse, ServerRequest} from "http";

/**
 * Classes that intercepts response result must implement this interface.
 */
export interface MiddlewareInterface {

    /**
     * Called before controller action is being executed.
     */
    use?(request: ServerRequest, response: ServerResponse, next: Function): void;

    /**
     * Called after controller action is being executed.
     */
    afterUse?(request: ServerRequest, response: ServerResponse, finish: Function): void;

}
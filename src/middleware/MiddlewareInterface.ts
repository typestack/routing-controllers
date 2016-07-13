/**
 * Classes that intercepts response result must implement this interface.
 */
export interface MiddlewareInterface {

    /**
     * Called before controller action is being executed.
     * This signature is used for Express Middlewares.
     */
    use?(request: any, response: any, next?: Function): any;

    /**
     * Called before controller action is being executed.
     * This signature is used for Koa Middlewares.
     */
    use?(context: any, next: Function): Promise<any>;

}
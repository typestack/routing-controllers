/**
 * Used to register middlewares.
 */
export interface ExpressMiddlewareInterface {

    /**
     * Called before controller action is being executed.
     * This signature is used for Express Middlewares.
     */
    use(request: any, response: any, next: (err?: any) => any): any;

}
/**
 * Used to register middlewares.
 * This signature is used for Koa Middlewares.
 */
export interface KoaMiddlewareInterface {

    /**
     * Called before controller action is being executed.
     */
    use(context: any, next: (err?: any) => Promise<any>): Promise<any>;

}
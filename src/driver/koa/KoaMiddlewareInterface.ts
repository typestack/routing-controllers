/**
 * Used to register middlewares.
 * This signature is used for koa middlewares.
 */
export interface KoaMiddlewareInterface {

    /**
     * Called before controller action is being executed.
     */
    use(context: any, next: (err?: any) => Promise<any>): Promise<any>;

}
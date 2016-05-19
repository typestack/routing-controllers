/**
 * Classes that intercepts response result must implement this interface.
 */
export interface KoaMiddlewareInterface {

    /**
     * Called before controller action is being executed.
     */
    use(context: any, next: () => Promise<any>): Promise<any>

}
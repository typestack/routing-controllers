/**
 * Metadata used to store registered intercept for a specific controller or controller action.
 */
export interface UseInterceptorMetadataArgs {

    /**
     * Indicates if this interceptor is global, thous applied to all routes.
     */
    global?: boolean;

    /**
     * Interceptor class or a function to be executed.
     */
    interceptor: Function;

    /**
     * Controller method to which this intercept is applied.
     * If method is not given it means intercept is used on the controller.
     * Then intercept is applied to all controller's actions.
     */
    method?: string;

    /**
     * Execution priority of the interceptor.
     */
    priority?: number;

    /**
     * Controller class where this intercept was used.
     */
    target: Function;

}

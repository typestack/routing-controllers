export interface ActionCallbackOptions {

    context?: any;
    request: any;
    response: any;
    next: Function;

    /**
     * Interceptor functions to be applied for response result.
     */
    useInterceptorFunctions?: Function[];

}

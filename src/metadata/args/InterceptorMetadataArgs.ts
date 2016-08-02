/**
 * Metadata used to store registered interceptor.
 */
export interface InterceptorMetadataArgs {

    /**
     * Object class of the interceptor class.
     */
    target: Function;

    /**
     * Indicates if this interceptor is global, thous applied to all routes.
     */
    isGlobal: boolean;

    /**
     * Execution priority of the interceptor.
     */
    priority: number;

}
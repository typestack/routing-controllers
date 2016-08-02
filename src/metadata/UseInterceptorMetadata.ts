import {UseInterceptorMetadataArgs} from "./args/UseInterceptorMetadataArgs";

export class UseInterceptorMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Object class of the middleware class.
     */
    target: Function;

    /**
     * Method used by this intercept.
     */
    method: string;

    /**
     * Interceptor to be executed by this intercept.
     */
    interceptor: Function;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(args: UseInterceptorMetadataArgs) {
        this.target = args.target;
        this.method = args.method;
        this.interceptor = args.interceptor;
    }

}
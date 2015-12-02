import {ResponseInterceptorInterface} from "../interceptor/ResponseInterceptorInterface";

/**
 * Metadata used to storage information about registered request interceptors.
 *
 * @internal
 */
export interface ResponseInterceptorMetadata {

    /**
     * Object class of the response interceptor.
     */
    object: Function;

    /**
     * Response interceptor instance.
     */
    instance?: ResponseInterceptorInterface;

    /**
     * Priority of the response interceptor.
     */
    priority: number;
}
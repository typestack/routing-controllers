import {ResponseInterceptorInterface} from "./interceptor/ResponseInterceptorInterface";

/**
 * Options used to send to framework result handlers.
 *
 * @internal
 */
export interface ResultHandleOptions {

    /**
     * User request.
     */
    request: any;

    /**
     * User response.
     */
    response: any;

    /**
     * Content to be sent in result.
     */
    content: any;

    /**
     * Indicates if response result should be handled as json.
     */
    asJson: boolean;

    /**
     * Status code to be set in the response result.
     */
    httpCode: number;

    /**
     * Interceptors used to catch (and do something) with response result before it will be sent.
     */
    interceptors: ResponseInterceptorInterface[];
}
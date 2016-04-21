import {ResponseInterceptorInterface} from "./interceptor/ResponseInterceptorInterface";

/**
 * Options used to send to framework result handlers.
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
     * Status code to be set in the response result in the case if response success.
     */
    successHttpCode: number;

    /**
     * Status code to be set in the response result in the case if response fail.
     */
    errorHttpCode: number;

    /**
     * Status code to be set in the response when controller returned empty result.
     */
    emptyResultCode: number;

    /**
     * Status code to be set in the response when controller returned null result.
     */
    nullResultCode: number;

    /**
     * Status code to be set in the response when controller returned undefined result.
     */
    undefinedResultCode: number;

    /**
     * If set then redirection will work on the given address.
     */
    redirect: string;

    /**
     * Interceptors used to catch (and do something) with response result before it will be sent.
     */
    interceptors: ResponseInterceptorInterface[];

    /**
     * Custom response headers.
     */
    headers: {
        name: string;
        value: string;
    }[];

    /**
     * Template to be rendered.
     */
    renderedTemplate: string;

}
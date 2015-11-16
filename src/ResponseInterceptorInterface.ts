export interface ResponseInterceptorInterface {

    /**
     * Called when response.send has been called. The data passed to method is the data passed to .send method.
     * Note that you must return same (or changed) data, so it can be passed to .send method.
     */
    onSend?(data: any, request: any, response: any): any;

    /**
     * Called when response.json has been called. The data passed to method is the data passed to .json method.
     * Note that you must return same (or changed) data, so it can be passed to .json method.
     */
    onJson?(data: any, request: any, response: any): any;

}
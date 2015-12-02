/**
 * Classes that intercepts response result must implement this interface.
 */
export interface ResponseInterceptorInterface {

    /**
     * Called before response.send is being called. The data passed to method is the data passed to .send method.
     * Note that you must return same (or changed) data and it will be passed to .send method.
     */
    onSend?(data: any, request: any, response: any): any;

    /**
     * Called before response.json is being called. The data passed to method is the data passed to .json method.
     * Note that you must return same (or changed) data and it will be passed to .json method.
     */
    onJson?(data: any, request: any, response: any): any;

}
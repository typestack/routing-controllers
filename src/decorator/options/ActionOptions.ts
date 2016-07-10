/**
 * Extra that can be set to action.
 */
export interface ActionOptions {

    /**
     * Response type. If set to "json" then json response will be returned. 
     * If set to "default" then regular text response will be returned.
     */
    responseType?: "json"|"text";
    
}
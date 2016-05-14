/**
 * Extra that can be set to action.
 */
export interface ActionOptions {

    /**
     * If set to true then response will be forced to json (serialized and application/json content-type will be used).
     */
    jsonResponse?: boolean;

    /**
     * If set to true then response will be forced to simple string text response.
     */
    textResponse?: boolean;
}
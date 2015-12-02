/**
 * Controller metadata used to storage information about registered http code.
 */
export interface HttpCodeMetadata {

    /**
     * Http status code to be set response.
     */
    code: number;

    /**
     * Object on which's method decorator is set.
     */
    object: any;

    /**
     * Method on which decorator is set.
     */
    method: string;

    /**
     * Http type.
     */
    type: number;
}

export enum HttpCodeType {
    SUCCESS = 1
}
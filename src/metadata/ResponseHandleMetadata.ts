import {ResponseHandleType} from "./types/ResponsePropertyTypes";

/**
 * Storages information about registered response handlers.
 */
export interface ResponseHandleMetadata {

    /**
     * Object on which's method decorator is set.
     */
    object: any;

    /**
     * Method on which decorator is set.
     */
    method: string;

    /**
     * Property type. See ResponsePropertyMetadataType for possible values.
     */
    type: ResponseHandleType;

    /**
     * Property value. Can be status code, content-type, header name, template name, etc.
     */
    primaryValue: any;

    /**
     * Secondary property value. Can be header value for example.
     */
    secondaryValue?: any;
    
}
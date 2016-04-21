/**
 * Controller metadata used to storage information about different response properties.
 */
export interface ResponsePropertyMetadata {

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
    type: number;

    /**
     * Property value. Can be status code, content-type, header name, template name, etc.
     */
    value: any;

    /**
     * Secondary property value. Can be header value for example.
     */
    value2?: any;
}

export enum ResponsePropertyType {
    SUCCESS_CODE = 1,
    ERROR_CODE = 2,
    CONTENT_TYPE = 3,
    HEADER = 4,
    RENDERED_TEMPLATE = 5,
    REDIRECT = 6,
    LOCATION = 7,
    EMPTY_RESULT_CODE = 8,
    NULL_RESULT_CODE = 9,
    UNDEFINED_RESULT_CODE = 10
}
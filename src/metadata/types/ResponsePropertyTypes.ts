export type ResponseHandlerType = "success_code"|"error_code"|"content_type"|"header"|"rendered_template"
    |"redirect"|"location"|"empty_result_code"|"null_result_code"|"undefined_result_code"|"text_response"|"json_response"
    |"response_class_transform_options";

export class ResponseHandlerTypes {
    static SUCCESS_CODE: ResponseHandlerType = "success_code";
    static ERROR_CODE: ResponseHandlerType = "error_code";
    static CONTENT_TYPE: ResponseHandlerType = "content_type";
    static HEADER: ResponseHandlerType = "header";
    static RENDERED_TEMPLATE: ResponseHandlerType = "rendered_template";
    static REDIRECT: ResponseHandlerType = "redirect";
    static LOCATION: ResponseHandlerType = "location";
    static EMPTY_RESULT_CODE: ResponseHandlerType = "empty_result_code";
    static NULL_RESULT_CODE: ResponseHandlerType = "null_result_code";
    static TEXT_RESPONSE: ResponseHandlerType = "text_response";
    static JSON_RESPONSE: ResponseHandlerType = "json_response";
    static UNDEFINED_RESULT_CODE: ResponseHandlerType = "undefined_result_code";
    static RESPONSE_CLASS_TRANSFORM_OPTIONS: ResponseHandlerType = "response_class_transform_options";
}
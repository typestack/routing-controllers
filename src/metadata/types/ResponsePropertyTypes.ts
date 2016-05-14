export type ResponseHandleType = "success_code"|"error_code"|"content_type"|"header"|"rendered_template"
    |"redirect"|"location"|"empty_result_code"|"null_result_code"|"undefined_result_code";

export class ResponseHandleTypes {
    static SUCCESS_CODE: ResponseHandleType = "success_code";
    static ERROR_CODE: ResponseHandleType = "error_code";
    static CONTENT_TYPE: ResponseHandleType = "content_type";
    static HEADER: ResponseHandleType = "header";
    static RENDERED_TEMPLATE: ResponseHandleType = "rendered_template";
    static REDIRECT: ResponseHandleType = "redirect";
    static LOCATION: ResponseHandleType = "location";
    static EMPTY_RESULT_CODE: ResponseHandleType = "empty_result_code";
    static NULL_RESULT_CODE: ResponseHandleType = "null_result_code";
    static UNDEFINED_RESULT_CODE: ResponseHandleType = "undefined_result_code";
}
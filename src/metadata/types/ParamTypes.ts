/**
 * Controller action's parameter type.
 */
export type ParamType = "body"|"query"|"header"|"file"|"files"|"body_param"|"param"|"cookie"|"request"|"response"|"custom_converter";

/**
 * Controller action's parameter type.
 */
export class ParamTypes {
    static BODY: ParamType = "body";
    static QUERY: ParamType = "query";
    static HEADER: ParamType = "header";
    static FILE: ParamType = "file";
    static FILES: ParamType = "files";
    static BODY_PARAM: ParamType = "body_param";
    static PARAM: ParamType = "param";
    static COOKIE: ParamType = "cookie";
    static REQUEST: ParamType = "request";
    static RESPONSE: ParamType = "response";
    static CUSTOM_CONVERTER: ParamType = "custom_converter";
}
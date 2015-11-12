export interface ActionMetadata {
    path: string;
    object: any;
    method: string;
    type: string;
    options: ActionOptions;
}

export interface ActionOptions {

    /**
     * If set to true the response will be forced to json.
     */
    jsonResponse?: boolean;

    /**
     * If set to true the response will be forced to simple text response.
     */
    textResponse?: boolean;
}

export class ActionType {
    static CHECKOUT = 'checkout';
    static CONNECT = 'connect';
    static COPY = 'copy';
    static DELETE = 'delete';
    static GET = 'get';
    static HEAD = 'head';
    static LOCK = 'lock';
    static MERGE = 'merge';
    static MKACTIVITY = 'mkactivity';
    static MKCOL = 'mkcol';
    static MOVE = 'move';
    static M_SEARCH = 'm-search';
    static NOTIFY = 'notify';
    static OPTIONS = 'options';
    static PATCH = 'patch';
    static POST = 'post';
    static PROPFIND = 'propfind';
    static PROPPATCH = 'proppatch';
    static PURGE = 'purge';
    static PUT = 'put';
    static REPORT = 'report';
    static SEARCH = 'search';
    static SUBSCRIBE = 'subscribe';
    static TRACE = 'trace';
    static UNLOCK = 'unlock';
    static UNSUBSCRIBE = 'unsubscribe';
}
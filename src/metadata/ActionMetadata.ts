/**
 * Action metadata used to storage information about registered action.
 *
 * @internal
 */
export interface ActionMetadata {

    /**
     * Route to be registered for the action.
     */
    route: string|RegExp;

    /**
     * Object on which's method this action is attached.
     */
    object: any;

    /**
     * Object's method that will be executed on this action.
     */
    method: string;

    /**
     * Action type represents http method used for the registered route. Can be one of the value defined in ActionTypes
     * class.
     */
    type: string;

    /**
     * Additional action options.
     */
    options: ActionOptions;
}

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

/**
 * All action types that can be used for the controller method.
 */
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
/**
 * Controller action type.
 */
export type ActionType = "checkout"|"connect"|"copy"|"delete"|"get"|"head"|"lock"|"merge"|"mkactivity"|"mkcol"|
    "move"|"m-search"|"notify"|"options"|"patch"|"post"|"propfind"|"proppatch"|"purge"|"put"|"report"|"search"|
    "subscribe"|"trace"|"unlock"|"unsubscribe";

/**
 * Static access to action types.
 */
export class ActionTypes {
    static CHECKOUT: ActionType = "checkout";
    static CONNECT: ActionType = "connect";
    static COPY: ActionType = "copy";
    static DELETE: ActionType = "delete";
    static GET: ActionType = "get";
    static HEAD: ActionType = "head";
    static LOCK: ActionType = "lock";
    static MERGE: ActionType = "merge";
    static MKACTIVITY: ActionType = "mkactivity";
    static MKCOL: ActionType = "mkcol";
    static MOVE: ActionType = "move";
    static M_SEARCH: ActionType = "m-search";
    static NOTIFY: ActionType = "notify";
    static OPTIONS: ActionType = "options";
    static PATCH: ActionType = "patch";
    static POST: ActionType = "post";
    static PROPFIND: ActionType = "propfind";
    static PROPPATCH: ActionType = "proppatch";
    static PURGE: ActionType = "purge";
    static PUT: ActionType = "put";
    static REPORT: ActionType = "report";
    static SEARCH: ActionType = "search";
    static SUBSCRIBE: ActionType = "subscribe";
    static TRACE: ActionType = "trace";
    static UNLOCK: ActionType = "unlock";
    static UNSUBSCRIBE: ActionType = "unsubscribe";
}
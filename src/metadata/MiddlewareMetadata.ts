import {MiddlewareMetadataArgs} from "./args/MiddlewareMetadataArgs";
import {MiddlewareInterface} from "../middleware/MiddlewareInterface";
import {ErrorMiddlewareInterface} from "../middleware/ErrorMiddlewareInterface";
import {getFromContainer} from "../container";

export class MiddlewareMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Indicates if this middleware is global, thous applied to all routes.
     */
    isGlobal: boolean;

    /**
     * Object class of the middleware class.
     */
    target: Function;

    /**
     * Execution priority of the middleware.
     */
    priority: number;
    
    /**
     * Indicates if middleware must be executed after routing action is executed.
     */
    afterAction: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: MiddlewareMetadataArgs) {
        this.isGlobal = args.isGlobal;
        this.target = args.target;
        this.priority = args.priority;
        this.afterAction = args.afterAction;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get isErrorHandler(): boolean {
        return !!(this.errorHandlerInstance && this.errorHandlerInstance.error);
    }

    get isUseMiddleware(): boolean {
        return !!(this.instance && this.instance.use);
    }

    get instance(): MiddlewareInterface {
        return getFromContainer<MiddlewareInterface>(this.target);
    }

    get errorHandlerInstance(): ErrorMiddlewareInterface {
        return getFromContainer<ErrorMiddlewareInterface>(this.target);
    }
    
}
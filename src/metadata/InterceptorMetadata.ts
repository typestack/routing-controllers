import {getFromContainer} from "../container";
import {InterceptorInterface} from "../middleware/InterceptorInterface";
import {InterceptorMetadataArgs} from "./args/InterceptorMetadataArgs";

export class InterceptorMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Indicates if this interceptor is global, thous applied to all routes.
     */
    isGlobal: boolean;

    /**
     * Object class of the interceptor class.
     */
    target: Function;

    /**
     * Execution priority of the interceptor.
     */
    priority: number;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: InterceptorMetadataArgs) {
        this.isGlobal = args.isGlobal;
        this.target = args.target;
        this.priority = args.priority;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get instance(): InterceptorInterface {
        return getFromContainer<InterceptorInterface>(this.target);
    }
    
}
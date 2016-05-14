import {getContainer} from "../index";
import {MiddlewareMetadataArgs} from "./args/MiddlewareMetadataArgs";
import {MiddlewareInterface} from "../middleware/MiddlewareInterface";

export class MiddlewareMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Object class of the middleware class.
     */
    target: Function;

    /**
     * Middleware name.
     */
    name: string;

    /**
     * Execution priority of the middleware.
     */
    priority: number;

    /**
     * List of routes to which this middleware is applied.
     */
    routes: string[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: MiddlewareMetadataArgs) {
        if (args.target)
            this.target = args.target;
        if (args.name)
            this.name = args.name;
        if (args.priority)
            this.priority = args.priority;
        if (args.routes)
            this.routes = args.routes;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get instance(): MiddlewareInterface {
        return getContainer().get<MiddlewareInterface>(this.target);
    }

    
}
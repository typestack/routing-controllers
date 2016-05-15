import {getContainer} from "../index";
import {ErrorHandlerInterface} from "../middleware/ErrorHandlerInterface";
import {ErrorHandlerMetadataArgs} from "./args/ErrorHandlerMetadataArgs";

export class ErrorHandlerMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Object class of the error handler class.
     */
    target: Function;

    /**
     * Middleware name.
     */
    name: string;

    /**
     * Execution priority of the error handler.
     */
    priority: number;

    /**
     * List of routes to which this error handler is applied.
     */
    routes: string[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: ErrorHandlerMetadataArgs) {
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

    get instance(): ErrorHandlerInterface {
        return getContainer().get<ErrorHandlerInterface>(this.target);
    }

    get hasRoutes() {
        return this.routes && this.routes.length > 0;
    }
    
}
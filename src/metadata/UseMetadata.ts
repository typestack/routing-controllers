import {UseMetadataArgs} from "../metadata-args/UseMetadataArgs";

/**
 * "Use middleware" metadata.
 */
export class UseMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Object class of the middleware class.
     */
    target: Function;

    /**
     * Method used by this "use".
     */
    method: string;

    /**
     * Middleware to be executed by this "use".
     */
    middleware: Function;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: UseMetadataArgs) {
        this.target = args.target;
        this.method = args.method;
        this.middleware = args.middleware;
    }
    
}
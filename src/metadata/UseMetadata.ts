import {UseMetadataArgs} from './args/UseMetadataArgs';

/**
 * "Use middleware" metadata.
 */
export class UseMetadata {

    /**
     * Indicates if middleware must be executed after routing action is executed.
     */
    public afterAction: boolean;

    /**
     * Method used by this "use".
     */
    public method: string;

    /**
     * Middleware to be executed by this "use".
     */
    public middleware: Function;

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Object class of the middleware class.
     */
    public target: Function;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(args: UseMetadataArgs) {
        this.target = args.target;
        this.method = args.method;
        this.middleware = args.middleware;
        this.afterAction = args.afterAction;
    }

}

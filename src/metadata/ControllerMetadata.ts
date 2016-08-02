import {ActionMetadata} from "./ActionMetadata";
import {ControllerMetadataArgs} from "./args/ControllerMetadataArgs";
import {UseMetadata} from "./UseMetadata";
import {getFromContainer} from "../container";
import {UseInterceptorMetadata} from "./UseInterceptorMetadata";

export class ControllerMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Controller actions.
     */
    actions: ActionMetadata[];

    /**
     * Indicates object which is used by this controller.
     */
    target: Function;

    /**
     * Base route for all actions registered in this controller.
     */
    route: string;

    /**
     * Controller type. Can be default or json-typed. Json-typed controllers operate with json requests and responses.
     */
    type: "default"|"json";

    /**
     * Middleware "use"-s applied to a whole controller.
     */
    uses: UseMetadata[];

    /**
     * Intercepts applied to a whole controller.
     */
    useInterceptors: UseInterceptorMetadata[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: ControllerMetadataArgs) {
        if (args.target)
            this.target = args.target;
        if (args.route)
            this.route = args.route;
        if (args.type)
            this.type = args.type;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    
    get isJsonTyped() {
        return this.type === "json";
    }

    get instance(): any {
        return getFromContainer(this.target);
    }
    
}
import {ActionMetadata} from "./ActionMetadata";
import {ControllerMetadataArgs} from "./args/ControllerMetadataArgs";
import {UseMetadata} from "./UseMetadata";
import {getFromContainer} from "../container";

/**
 * Controller metadata.
 */
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

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: ControllerMetadataArgs) {
        this.target = args.target;
        this.route = args.route;
        this.type = args.type;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Gets instance of the controller.
     */
    get instance(): any {
        return getFromContainer(this.target);
    }
    
}
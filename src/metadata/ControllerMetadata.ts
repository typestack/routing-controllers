import {ActionMetadata} from "./ActionMetadata";
import {ControllerMetadataArgs} from "../metadata-args/ControllerMetadataArgs";
import {UseMetadata} from "./UseMetadata";
import {ResponseHandlerMetadata} from "./ResponseHandleMetadata";

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
    type: "default"|"json"|"model";

    /**
     * Middleware "use"-s applied to a whole controller.
     */
    uses: UseMetadata[];

    /**
     * Interceptors to be executed on this controller.
     */
    interceptors: Function[];

    /**
     * Indicates if this action uses Authorized decorator.
     */
    isAuthorizedUsed: boolean;

    /**
     * Roles set by @Authorized decorator.
     */
    authorizedRoles: any[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(args: ControllerMetadataArgs) {
        this.target = args.target;
        this.route = args.route;
        this.type = args.type;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds everything controller metadata needs.
     * Controller metadata should be used only after its build.
     */
    build(responseHandlers: ResponseHandlerMetadata[]) {
        const authorizedHandler = responseHandlers.find(handler => handler.type === "authorized" && !handler.method);
        this.isAuthorizedUsed = !!authorizedHandler;
        this.authorizedRoles = [].concat((authorizedHandler && authorizedHandler.value) || []);
    }

}
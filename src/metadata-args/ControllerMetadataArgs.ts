/**
 * Controller metadata used to storage information about registered controller.
 */
export interface ControllerMetadataArgs {

    /**
     * Controller type. Can be default or json-typed. Json-typed controllers operate with json requests and responses.
     */
    type: "default"|"json"|"graph";

    /**
     * Indicates object which is used by this controller.
     */
    target: Function;

    /**
     * Model used for this controller.
     */
    model?: Function;

    /**
     * Base route for all actions registered in this controller.
     */
    route?: string;
    
}
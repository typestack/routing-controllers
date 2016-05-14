/**
 * Controller metadata used to storage information about registered controller.
 */
export interface ControllerMetadata {

    /**
     * Indicates object which is used by this controller.
     */
    object: Function;

    /**
     * Base route for all actions registered in this controller.
     */
    route: string;

    /**
     * Controller type. Can be default or json-typed. Json-typed controllers operate with json requests and responses.
     */
    type: "default"|"json";
    
}
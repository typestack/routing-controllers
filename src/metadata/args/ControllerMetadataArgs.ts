/**
 * Controller metadata used to storage information about registered controller.
 */
export interface ControllerMetadataArgs {

    /**
     * Base route for all actions registered in this controller.
     */
    route: string;

    /**
     * Indicates object which is used by this controller.
     */
    target: Function;

    /**
     * Controller type. Can be default or json-typed. Json-typed controllers operate with json requests and responses.
     */
    type: 'default'|'json';

}

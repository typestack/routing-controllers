import {ActionType} from "../types/ActionType";
import {ActionProperties} from "../../ActionProperties";
import {ActionMetadata} from "../ActionMetadata";

/**
 * Action metadata used to storage information about registered action.
 */
export interface ActionMetadataArgs {

    /**
     * Route to be registered for the action.
     */
    route: string|RegExp;

    /**
     * Class on which's method this action is attached.
     */
    target: Function;
    
    /**
     * Object's method that will be executed on this action.
     */
    method: string;

    /**
     * Action type represents http method used for the registered route. Can be one of the value defined in ActionTypes
     * class.
     */
    type: ActionType;

    /**
     * Params to be appended to the method call.
     */
    appendParams?: (actionProperties: ActionProperties) => any[];

    /**
     * Special function that will be called instead of orignal method of the target.
     */
    methodOverride?: (actionMetadata: ActionMetadata, actionProperties: ActionProperties, params: any[]) => Promise<any>|any;
    
}
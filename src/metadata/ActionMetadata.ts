import {ActionOptions} from "../decorator/options/ActionOptions";
import {ActionType} from "./types/ActionTypes";

/**
 * Action metadata used to storage information about registered action.
 */
export interface ActionMetadata {

    /**
     * Route to be registered for the action.
     */
    route: string|RegExp;

    /**
     * Object on which's method this action is attached.
     */
    object: any;

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
     * Additional action options.
     */
    options: ActionOptions;
    
}
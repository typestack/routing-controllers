import {ActionType} from "../types/ActionType";
import {Action} from "../Action";

/**
 * Action metadata used to storage information about registered action.
 */
export interface ActionMetadataArgs {

    /**
     * Route to be registered for the action.
     */
    route?: string|RegExp;

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
     * Params to be changed on the method call.
     */
    parametersHandler?: (action: Action, params: any[]) => any[];

}
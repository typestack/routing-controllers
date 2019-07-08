import {ActionType} from '../types/ActionType';
import {Action} from '../../Action';
import {ActionMetadata} from '../ActionMetadata';

/**
 * Action metadata used to storage information about registered action.
 */
export interface ActionMetadataArgs {
  /**
   * Params to be appended to the method call.
   */
  appendParams?: (action: Action) => Array<any>;

  /**
   * Object's method that will be executed on this action.
   */
  method: string;

  /**
   * Special function that will be called instead of orignal method of the target.
   */
  methodOverride?: (actionMetadata: ActionMetadata, action: Action, params: Array<any>) => Promise<any> | any;

  /**
   * Route to be registered for the action.
   */
  route: string | RegExp;

  /**
   * Class on which's method this action is attached.
   */
  target: Function;

  /**
   * Action type represents http method used for the registered route. Can be one of the value defined in ActionTypes
   * class.
   */
  type: ActionType;
}

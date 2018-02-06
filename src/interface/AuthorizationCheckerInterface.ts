import {Action} from "../Action";

/**
 * Special function used to check user authorization roles per request.
 * Must return true or promise with boolean true resolved for authorization to succeed.
 */
export type AuthorizationCheckerInterface = (action: Action, roles: any[]) => Promise<boolean>|boolean;
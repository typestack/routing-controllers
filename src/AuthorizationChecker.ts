import {ActionProperties} from "./ActionProperties";

/**
 * Special function used to check user authorization roles per request.
 * Must return true or promise with boolean true resolved for authorization to succeed.
 */
export type AuthorizationChecker = (actionProperties: ActionProperties, roles: string[]) => Promise<boolean>|boolean;
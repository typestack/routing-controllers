import {ActionProperties} from "./ActionProperties";

/**
 * Special function used to get currently authorized user.
 */
export type CurrentUserChecker = (actionProperties: ActionProperties) => Promise<any>|any;
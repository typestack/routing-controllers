import {Action} from './Action';

/**
 * Special function used to get currently authorized user.
 */
export type CurrentUserChecker = (action: Action) => Promise<any> | any;

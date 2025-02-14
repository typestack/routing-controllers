import { Action } from './Action';

/**
 * Special function used to get currently authorized user.
 */
export type CurrentUserChecker = <User = any>(action: Action) => Promise<User | null> | User | null;

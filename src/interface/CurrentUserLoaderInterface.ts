import {Action} from "../Action";

/**
 * Special function used to get currently authorized user.
 */
export type CurrentUserLoaderInterface = (action: Action) => Promise<any>|any;
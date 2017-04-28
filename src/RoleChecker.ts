import {ActionProperties} from "./ActionProperties";

export interface RoleChecker {

    check(actionProperties: ActionProperties): boolean|Promise<boolean>;

}
import {Action} from "../Action";

export interface RoleCheckerInterface {

    check(action: Action): boolean|Promise<boolean>;

}
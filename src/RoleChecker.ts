import {Action} from './Action';

export interface RoleChecker {
  check(action: Action): boolean | Promise<boolean>;
}

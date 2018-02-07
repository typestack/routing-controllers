import {GraphController} from "../../../../src/decorator/GraphController";
import {Query} from "../../../../src/decorator/Query";
import {RoleRegistry} from "../service/RoleRegistry";
import {Role} from "../model/Role";

@GraphController()
export class RoleController {

    constructor(private roleRegistry: RoleRegistry) {
    }

    @Query()
    roles(): Role[] {
        return this.roleRegistry.roles;
    }

}
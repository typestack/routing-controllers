import {ForbiddenError} from "../../../../../../src";

export class PhotoAccessDeniedError extends ForbiddenError {

    constructor() {
        super(`Access is denied for the given photo.`);
    }

}
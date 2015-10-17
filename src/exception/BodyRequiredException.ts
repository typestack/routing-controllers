export class BodyRequiredException extends Error {
    name = 'BodyRequiredException';

    constructor(url: string, method: string) {
        super();
        this.message = 'Request body is required for request on ' + method + ' ' + url;
    }

}
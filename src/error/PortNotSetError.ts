/**
 * Thrown when user tries to run the framework but port on which server must run is not set.
 */
export class PortNotSetError extends Error {

    name = "PortNotSetError";

    constructor() {
        super(`Cannot start server because port is not set. Please set port in the framework options.`);
        Object.setPrototypeOf(this, PortNotSetError.prototype);
    }

}

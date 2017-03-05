export class BadHttpActionError extends Error {
    name = "BadHttpActionError";

    constructor(action: string) {
        super();
        Object.setPrototypeOf(this, BadHttpActionError.prototype);
        
        this.message = `Method with the given action ${action} cannot be registered in the server framework.`;
    }

}
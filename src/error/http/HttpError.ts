/**
 * Used to throw Http errors.
 */
export class HttpError extends Error {
    httpCode: number;
    message: string;

    constructor(httpCode: number, message?: string) {
        super();
        Object.setPrototypeOf(this, HttpError.prototype);
        
        if (httpCode)
            this.httpCode = httpCode;
        if (message)
            this.message = message;

        this.stack = new Error().stack;
    }
}
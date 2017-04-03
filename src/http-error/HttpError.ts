/**
 * Used to throw HTTP errors.
 * Just do throw new HttpError(code, message) in your controller action and
 * default error handler will catch it and give in your response given code and message .
 */
export class HttpError extends Error {

    httpCode: number;

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
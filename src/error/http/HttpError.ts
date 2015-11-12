export class HttpError extends Error {
    httpCode: number;

    constructor(httpCode: number) {
        super();
        if (httpCode)
            this.httpCode = httpCode;
    }
}
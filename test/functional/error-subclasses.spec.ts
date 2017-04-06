import {expect} from "chai";

import {HttpError} from "../../src/http-error/HttpError";
import {BadRequestError} from "../../src/http-error/BadRequestError";

describe("using Error subclasses should be possible,", () => {
    describe("HttpError", () => {
        it("should be instance of HttpError and Error", () => {
            const error = new HttpError(418, "Error message");
            expect(error.httpCode).to.equals(418);
            expect(error.message).to.equals("Error message");
            expect(error).to.be.instanceOf(HttpError);
            expect(error).to.be.instanceOf(Error);
        });
    });
    describe("BadRequestError", () => {
        it("should be instance of BadRequestError, HttpError and Error", () => {
            const error = new BadRequestError("Error message");
            expect(error.httpCode).to.equals(400);
            expect(error.message).to.equals("Error message");
            expect(error).to.be.instanceOf(BadRequestError);
            expect(error).to.be.instanceOf(HttpError);
            expect(error).to.be.instanceOf(Error);
        });
    });
});

import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
import {createExpressServer} from "../../src/index";
import {defaultMetadataArgsStorage} from "../../src/metadata-builder/MetadataArgsStorage";
import {ExpressErrorMiddlewareInterface} from "../../src/driver/express/ExpressErrorMiddlewareInterface";
import {NotFoundError} from "../../src/http-error/NotFoundError";
import {Middleware} from "../../src/decorator/Middleware";
const chakram = require("chakram");
const expect = chakram.expect;

describe("custom express error handling", () => {

    let errorHandlerCalled: boolean;

    beforeEach(() => {
        errorHandlerCalled = undefined;
    });
    
    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage.reset();

        @Middleware({ type: "after" })
        class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
            error(error: any, req: any, res: any, next: any) {
                errorHandlerCalled = true;
                
                res.status(error.httpCode).send(error.message);
            }
        }

        @JsonController()
        class ExpressErrorHandlerController {
            @Get("/blogs")
            blogs() {
                return {
                    id: 1,
                    title: "About me"
                };
            }

            @Get("/videos")
            videos() {
                throw new NotFoundError("Videos were not found.");
            }
        }
    });

    let app: any;
    before(done => app = createExpressServer({defaultErrorHandler: false}).listen(3001, done));
    after(done => app.close(done));

    it("should not call global error handler middleware if there was no errors", () => {
        return chakram
            .get("http://127.0.0.1:3001/blogs")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.empty;
                expect(response).to.have.status(200);
            });
    });

    it("should call global error handler middleware", () => {
        return chakram
            .get("http://127.0.0.1:3001/videos")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.true;
                expect(response).to.have.status(404);
            });
    });

    it("should be able to send response", () => {
        return chakram
            .get("http://127.0.0.1:3001/videos")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.true;
                expect(response).to.have.status(404);
                expect(response.body).to.equals("Videos were not found.");
            });
    });
});
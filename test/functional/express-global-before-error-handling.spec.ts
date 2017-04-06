import "reflect-metadata";
import {JsonController} from "../../src/deprecated/JsonController";
import {createExpressServer} from "../../src/index";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Req} from "../../src/decorator/Req";
import {Res} from "../../src/decorator/Res";
import {Param} from "../../src/decorator/Param";
import {Post} from "../../src/decorator/Post";
import {UseBefore} from "../../src/decorator/UseBefore";
import {Session} from "../../src/decorator/Session";
import {State} from "../../src/decorator/State";
import {QueryParam} from "../../src/decorator/QueryParam";
import {HeaderParam} from "../../src/decorator/HeaderParam";
import {CookieParam} from "../../src/decorator/CookieParam";
import {Body} from "../../src/decorator/Body";
import {BodyParam} from "../../src/decorator/BodyParam";
import {UploadedFile} from "../../src/decorator/UploadedFile";
import {UploadedFiles} from "../../src/decorator/UploadedFiles";
import {JsonResponse} from "../../src/deprecated/JsonResponse";
import {Method} from "../../src/decorator/Method";
import {Head} from "../../src/decorator/Head";
import {Delete} from "../../src/decorator/Delete";
import {Patch} from "../../src/decorator/Patch";
import {Put} from "../../src/decorator/Put";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
import {ErrorMiddlewareInterface} from "../../src/middleware/ErrorMiddlewareInterface";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";


const chakram = require("chakram");
const expect = chakram.expect;

describe("custom express global before middleware error handling", () => {

    class CustomError extends Error {
      name = "CustomError";
      message = "custom error message!";
    }

    let errorHandlerCalled: boolean;
    let errorHandlerName: string;

    beforeEach(() => {
        errorHandlerCalled = undefined;
        errorHandlerName = undefined;
    });

    before(() => {


        @Middleware({ global: true })
        class GlobalBeforeMiddleware implements MiddlewareInterface {
            use(request: any, response: any, next?: Function): any {
              console.log("GLOBAL BEFORE MIDDLEWARE CALLED");
              throw new CustomError();
            }
        }

        @Middleware({ global: true, type: "after" })
        class CustomErrorHandler implements ErrorMiddlewareInterface {
            error(error: any, req: any, res: any, next: any) {
                errorHandlerCalled = true;
                errorHandlerName = error.name;
                res.status(error.httpCode).send(error.message);
            }
        }

        @JsonController()
        class ExpressErrorHandlerController {

          @Get("/answers")
          answers() {
            return {
                id: 1,
                title: "My answer"
            };
          }
        }
    });

    let app: any;
    before(done => app = createExpressServer({defaultErrorHandler: false}).listen(3001, done));
    after(done => app.close(done));

    it("should call global error handler middleware with CustomError", () => {
        return chakram
          .get("http://127.0.0.1:3001/answers")
          .then((response: any) => {
              expect(errorHandlerCalled).to.be.true;
              expect(errorHandlerName).to.equals("CustomError");
              expect(response).to.have.status(500);
          });
    });

});

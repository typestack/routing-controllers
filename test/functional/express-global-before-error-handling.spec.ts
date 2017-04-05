import "reflect-metadata";
import {JsonController} from "../../src/deprecated/JsonController";
import {Get} from "../../src/decorator/Method";
import {createExpressServer} from "../../src/index";
import {MiddlewareGlobalBefore, MiddlewareGlobalAfter} from "../../src/deprecated/JsonResponse";
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


        @MiddlewareGlobalBefore()
        class GlobalBeforeMiddleware implements MiddlewareInterface {
            use(request: any, response: any, next?: Function): any {
              console.log("GLOBAL BEFORE MIDDLEWARE CALLED");
              throw new CustomError();
            }
        }

        @MiddlewareGlobalAfter()
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

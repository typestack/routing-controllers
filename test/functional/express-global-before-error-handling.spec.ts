import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer} from "../../src/index";
import {Get} from "../../src/decorator/Get";
import {Middleware} from "../../src/decorator/Middleware";
import {ExpressErrorMiddlewareInterface} from "../../src/driver/express/ExpressErrorMiddlewareInterface";
import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";


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


        @Middleware({ type: "before" })
        class GlobalBeforeMiddleware implements ExpressMiddlewareInterface {
            use(request: any, response: any, next?: Function): any {
              throw new CustomError();
            }
        }

        @Middleware({ type: "after" })
        class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
            error(error: any, req: any, res: any, next: any) {
                errorHandlerCalled = true;
                errorHandlerName = error.name;
                res.status(error.httpCode || 500).send(error.message);
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

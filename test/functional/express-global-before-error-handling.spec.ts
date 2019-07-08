import 'reflect-metadata';
import {strictEqual} from 'assert';
import {JsonController} from '../../src/decorator/JsonController';
import {createExpressServer} from '../../src/index';
import {Get} from '../../src/decorator/Get';
import {Middleware} from '../../src/decorator/Middleware';
import {ExpressErrorMiddlewareInterface} from '../../src/driver/express/ExpressErrorMiddlewareInterface';
import {ExpressMiddlewareInterface} from '../../src/driver/express/ExpressMiddlewareInterface';

const chakram = require('chakram');

describe('custom express global before middleware error handling', () => {
  class CustomError extends Error {
    public message = 'custom error message!';
    public name = 'CustomError';
  }

  let errorHandlerCalled: boolean;
  let errorHandlerName: string;

  beforeEach(() => {
    errorHandlerCalled = undefined;
    errorHandlerName = undefined;
  });

  before(() => {
    @Middleware({type: 'before'})
    class GlobalBeforeMiddleware implements ExpressMiddlewareInterface {
      public use(request: any, response: any, next?: Function): any {
        throw new CustomError();
      }
    }

    @Middleware({type: 'after'})
    class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
      public error(error: any, req: any, res: any, next: any) {
        errorHandlerCalled = true;
        errorHandlerName = error.name;
        res.status(error.httpCode).send(error.message);
      }
    }

    @JsonController()
    class ExpressErrorHandlerController {
      @Get('/answers')
      public answers() {
        return {
          id: 1,
          title: 'My answer',
        };
      }
    }
  });

  let app: any;
  before(done => (app = createExpressServer({defaultErrorHandler: false}).listen(3001, done)));
  after(done => app.close(done));

  it('should call global error handler middleware with CustomError', () =>
    chakram.get('http://127.0.0.1:3001/answers').then((response: any) => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(errorHandlerName, 'CustomError');
      strictEqual(response.response.statusCode, 500);
    }));
});

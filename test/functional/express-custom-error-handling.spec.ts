import 'reflect-metadata';
import {strictEqual} from 'assert';
import {JsonController} from '../../src/decorator/JsonController';
import {Get} from '../../src/decorator/Get';
import {createExpressServer, getMetadataArgsStorage} from '../../src/index';
import {ExpressErrorMiddlewareInterface} from '../../src/driver/express/ExpressErrorMiddlewareInterface';
import {NotFoundError} from '../../src/http-error/NotFoundError';
import {Middleware} from '../../src/decorator/Middleware';

const chakram = require('chakram');

describe('custom express error handling', () => {
  let errorHandlerCalled: boolean;

  beforeEach(() => {
    errorHandlerCalled = undefined;
  });

  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Middleware({type: 'after'})
    class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
      public error(error: any, req: any, res: any, next: any) {
        errorHandlerCalled = true;

        res.status(error.httpCode).send(error.message);
      }
    }

    @JsonController()
    class ExpressErrorHandlerController {
      @Get('/blogs')
      public blogs() {
        return {
          id: 1,
          title: 'About me',
        };
      }

      @Get('/videos')
      public videos() {
        throw new NotFoundError('Videos were not found.');
      }
    }
  });

  let app: any;
  before(done => (app = createExpressServer({defaultErrorHandler: false}).listen(3001, done)));
  after(done => app.close(done));

  it('should not call global error handler middleware if there was no errors', () =>
    chakram.get('http://127.0.0.1:3001/blogs').then((response: any) => {
      strictEqual(errorHandlerCalled, void 0);
      strictEqual(response.response.statusCode, 200);
    }));

  it('should call global error handler middleware', () =>
    chakram.get('http://127.0.0.1:3001/videos').then((response: any) => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(response.response.statusCode, 404);
    }));

  it('should be able to send response', () =>
    chakram.get('http://127.0.0.1:3001/videos').then((response: any) => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(response.response.statusCode, 404);
      strictEqual(response.body, 'Videos were not found.');
    }));
});

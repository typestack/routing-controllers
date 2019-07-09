import 'reflect-metadata';
import {strictEqual} from 'assert';
import {JsonController} from '../../src/decorator/JsonController';
import {Get} from '../../src/decorator/Get';
import {createExpressServer, getMetadataArgsStorage} from '../../src/index';
import {ExpressErrorMiddlewareInterface} from '../../src/driver/express/ExpressErrorMiddlewareInterface';
import {NotFoundError} from '../../src/http-error/NotFoundError';
import {Middleware} from '../../src/decorator/Middleware';
import {assertRequest} from './test-utils';

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
    assertRequest([3001], {uri: 'blogs'}, response => {
      strictEqual(errorHandlerCalled, void 0);
      strictEqual(response.statusCode, 200);
    }));

  it('should call global error handler middleware', () =>
    assertRequest([3001], {uri: 'videos'}, response => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(response.statusCode, 404);
    }));

  it('should be able to send response', () =>
    assertRequest([3001], {uri: 'videos'}, response => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(response.statusCode, 404);
      strictEqual(response.body, 'Videos were not found.');
    }));
});

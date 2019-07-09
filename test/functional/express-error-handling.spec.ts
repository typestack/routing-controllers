import 'reflect-metadata';
import {strictEqual} from 'assert';
import {JsonController} from '../../src/decorator/JsonController';
import {createExpressServer, getMetadataArgsStorage} from '../../src/index';
import {Get} from '../../src/decorator/Get';
import {Middleware} from '../../src/decorator/Middleware';
import {UseAfter} from '../../src/decorator/UseAfter';
import {ExpressErrorMiddlewareInterface} from '../../src/driver/express/ExpressErrorMiddlewareInterface';
import {NotFoundError} from '../../src/http-error/NotFoundError';
import {HttpError} from '../../src/http-error/HttpError';
import {assertRequest} from './test-utils';

describe('express error handling', () => {
  let errorHandlerCalled: boolean;
  let errorHandledSpecifically: boolean;

  beforeEach(() => {
    errorHandlerCalled = undefined;
    errorHandledSpecifically = undefined;
  });

  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Middleware({type: 'after'})
    class AllErrorsHandler implements ExpressErrorMiddlewareInterface {
      public error(error: any, request: any, response: any, next?: Function): any {
        errorHandlerCalled = true;
        // ERROR HANDLED GLOBALLY
        next(error);
      }
    }

    class SpecificErrorHandler implements ExpressErrorMiddlewareInterface {
      public error(error: any, request: any, response: any, next?: Function): any {
        errorHandledSpecifically = true;
        // ERROR HANDLED SPECIFICALLY
        next(error);
      }
    }

    class SoftErrorHandler implements ExpressErrorMiddlewareInterface {
      public error(error: any, request: any, response: any, next?: Function): any {
        // ERROR WAS IGNORED
        next();
      }
    }

    class ToJsonError extends HttpError {
      public publicData: string;
      public secretData: string;

      constructor(httpCode: number, publicMsg?: string, privateMsg?: string) {
        super(httpCode);
        Object.setPrototypeOf(this, ToJsonError.prototype);
        this.publicData = publicMsg || 'public';
        this.secretData = privateMsg || 'secret';
      }

      public toJSON() {
        return {
          status: this.httpCode,
          publicData: `${this.publicData} (${this.httpCode})`,
        };
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

      @Get('/files')
      @UseAfter(SoftErrorHandler)
      public files() {
        throw new Error('Something is wrong... Cannot load files');
      }

      @Get('/photos')
      /*@UseAfter(function (error: any, send: any, response: any, next: Function) {
                useAfter = true;
                useCallOrder = "setFromUseAfter";
                next();
            })*/
      public photos() {
        return '1234';
      }

      @Get('/posts')
      public posts() {
        throw new Error('System error, cannot retrieve posts');
      }

      @Get('/questions')
      @UseAfter(SpecificErrorHandler)
      public questions() {
        throw new Error('Something is wrong... Cannot load questions');
      }

      @Get('/stories')
      public stories() {
        throw new ToJsonError(503, 'sorry, try it again later', 'impatient user');
      }

      @Get('/videos')
      public videos() {
        throw new NotFoundError('Videos were not found.');
      }
    }
  });

  let app: any;
  before(done => (app = createExpressServer().listen(3001, done)));
  after(done => app.close(done));

  it('should not call global error handler middleware if there was no errors', () =>
    assertRequest([3001], {uri: 'blogs'}, response => {
      strictEqual(errorHandlerCalled, void 0);
      strictEqual(errorHandledSpecifically, void 0);
      strictEqual(response.statusCode, 200);
    }));

  it('should call global error handler middleware', () =>
    assertRequest([3001], {uri: 'posts'}, response => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(errorHandledSpecifically, void 0);
      strictEqual(response.statusCode, 500);
    }));

  it('should call global error handler middleware', () =>
    assertRequest([3001], {uri: 'videos'}, response => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(errorHandledSpecifically, void 0);
      strictEqual(response.statusCode, 404);
    }));

  it('should call error handler middleware if used', () =>
    assertRequest([3001], {uri: 'questions'}, response => {
      strictEqual(errorHandlerCalled, true);
      strictEqual(errorHandledSpecifically, true);
      strictEqual(response.statusCode, 500);
    }));

  it('should not execute next middleware if soft error handled specifically and stopped error bubbling', () =>
    assertRequest([3001], {uri: 'files'}, response => {
      strictEqual(errorHandlerCalled, void 0);
      strictEqual(errorHandledSpecifically, void 0);
      strictEqual(response.statusCode, 500);
    }));

  it('should process JsonErrors by their toJSON method if it exists', () =>
    assertRequest([3001], {uri: 'stories'}, response => {
      strictEqual(response.statusCode, 503);
      strictEqual(response.body.status, 503);
      strictEqual(response.body.publicData, 'sorry, try it again later (503)');
      strictEqual(response.body.secretData, void 0);
    }));
});

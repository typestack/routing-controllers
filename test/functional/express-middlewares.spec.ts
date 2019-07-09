import 'reflect-metadata';
import {strictEqual} from 'assert';
import {createExpressServer, getMetadataArgsStorage} from '../../src/index';
import {ExpressMiddlewareInterface} from '../../src/driver/express/ExpressMiddlewareInterface';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {UseBefore} from '../../src/decorator/UseBefore';
import {Middleware} from '../../src/decorator/Middleware';
import {UseAfter} from '../../src/decorator/UseAfter';
import {NotAcceptableError} from './../../src/http-error/NotAcceptableError';
import {assertRequest} from './test-utils';

describe('express middlewares', () => {
  let useBefore: boolean,
    useAfter: boolean,
    useCustom: boolean,
    useCustomWithError: boolean,
    useGlobalBeforeWithError: boolean,
    useGlobalBefore: boolean,
    useGlobalAfter: boolean,
    useCallOrder: string,
    useGlobalCallOrder: string;

  beforeEach(() => {
    useBefore = false;
    useAfter = undefined;
    useCustom = undefined;
    useCustomWithError = undefined;
    useGlobalBeforeWithError = undefined;
    useGlobalBefore = undefined;
    useGlobalAfter = undefined;
    useCallOrder = undefined;
  });

  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Middleware({type: 'before'})
    class TestGlobalBeforeMidleware implements ExpressMiddlewareInterface {
      public use(request: any, response: any, next?: Function): any {
        useGlobalBefore = true;
        useGlobalCallOrder = 'setFromGlobalBefore';
        next();
      }
    }

    @Middleware({type: 'after'})
    class TestGlobalAfterMidleware implements ExpressMiddlewareInterface {
      public use(request: any, response: any, next?: Function): any {
        useGlobalAfter = true;
        useGlobalCallOrder = 'setFromGlobalAfter';
        next();
      }
    }

    class TestLoggerMiddleware implements ExpressMiddlewareInterface {
      public use(request: any, response: any, next?: Function): any {
        useCustom = true;
        next();
      }
    }

    class TestCustomMiddlewareWhichThrows implements ExpressMiddlewareInterface {
      public use(request: any, response: any, next?: Function): any {
        throw new NotAcceptableError('TestCustomMiddlewareWhichThrows');
      }
    }

    @Controller()
    class ExpressMiddlewareController {
      @Get('/blogs')
      public blogs() {
        useGlobalCallOrder = 'setFromController';
        return '1234';
      }

      @Get('/customMiddlewareWichThrows')
      @UseBefore(TestCustomMiddlewareWhichThrows)
      public customMiddlewareWichThrows() {
        return '1234';
      }

      @Get('/photos')
      @UseAfter(function(request: any, response: any, next: Function) {
        useAfter = true;
        useCallOrder = 'setFromUseAfter';
        next();
      })
      public photos() {
        useCallOrder = 'setFromController';
        return '1234';
      }

      @Get('/posts')
      @UseBefore(function(request: any, response: any, next: Function) {
        useBefore = true;
        useCallOrder = 'setFromUseBefore';
        next();
      })
      @UseAfter(function(request: any, response: any, next: Function) {
        useAfter = true;
        useCallOrder = 'setFromUseAfter';
        next();
      })
      public posts() {
        useCallOrder = 'setFromController';
        return '1234';
      }

      @Get('/questions')
      @UseBefore(TestLoggerMiddleware)
      public questions() {
        return '1234';
      }

      @Get('/users')
      @UseBefore(function(request: any, response: any, next: Function) {
        useBefore = true;
        useCallOrder = 'setFromUseBefore';
        next();
      })
      public users() {
        useCallOrder = 'setFromController';
        return '1234';
      }
    }
  });

  let app: any;
  before(done => (app = createExpressServer().listen(3001, done)));
  after(done => app.close(done));

  it('should call a global middlewares', () =>
    assertRequest([3001], {uri: 'blogs'}, response => {
      strictEqual(useGlobalBefore, true);
      strictEqual(useGlobalAfter, true);
      strictEqual(useGlobalCallOrder, 'setFromGlobalAfter');
      strictEqual(response.statusCode, 200);
    }));

  it('should use a custom middleware when @UseBefore or @UseAfter is used', () =>
    assertRequest([3001], {uri: 'questions'}, response => {
      strictEqual(useCustom, true);
      strictEqual(response.statusCode, 200);
    }));

  it('should call middleware and call it before controller action when @UseBefore is used', () =>
    assertRequest([3001], {uri: 'users'}, response => {
      strictEqual(useBefore, true);
      strictEqual(useCallOrder, 'setFromController');
      strictEqual(response.statusCode, 200);
    }));

  it('should call middleware and call it after controller action when @UseAfter is used', () =>
    assertRequest([3001], {uri: 'photos'}, response => {
      strictEqual(useAfter, true);
      strictEqual(useCallOrder, 'setFromUseAfter');
      strictEqual(response.statusCode, 200);
    }));

  it('should call before middleware and call after middleware when @UseAfter and @UseAfter are used', () =>
    assertRequest([3001], {uri: 'posts'}, response => {
      strictEqual(useBefore, true);
      strictEqual(useAfter, true);
      strictEqual(useCallOrder, 'setFromUseAfter');
      strictEqual(response.statusCode, 200);
    }));

  it('should handle errors in custom middlewares', () =>
    assertRequest([3001], {uri: 'customMiddlewareWichThrows'}, response => {
      strictEqual(response.statusCode, 406);
    }));
});

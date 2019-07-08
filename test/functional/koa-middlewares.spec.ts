import 'reflect-metadata';
import {strictEqual} from 'assert';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {UseBefore} from '../../src/decorator/UseBefore';
import {Middleware} from '../../src/decorator/Middleware';
import {UseAfter} from '../../src/decorator/UseAfter';
import {createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {KoaMiddlewareInterface} from '../../src/driver/koa/KoaMiddlewareInterface';
import {NotAcceptableError} from './../../src/http-error/NotAcceptableError';

const chakram = require('chakram');

describe('koa middlewares', () => {
  let useBefore: boolean,
    useAfter: boolean,
    useCustom: boolean,
    useGlobalBefore: boolean,
    useGlobalAfter: boolean,
    useCallOrder: string,
    useGlobalCallOrder: string;

  beforeEach(() => {
    useBefore = false;
    useAfter = undefined;
    useCustom = undefined;
    useGlobalBefore = undefined;
    useGlobalAfter = undefined;
    useCallOrder = undefined;
  });

  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Middleware({type: 'before'})
    class TestGlobalBeforeKoaMidleware implements KoaMiddlewareInterface {
      public use(context: any, next?: Function): any {
        useGlobalBefore = true;
        useGlobalCallOrder = 'setFromGlobalBefore';
        return next();
      }
    }

    @Middleware({type: 'after'})
    class TestGlobalAfterKoaMidleware implements KoaMiddlewareInterface {
      public use(context: any, next?: Function): any {
        useGlobalAfter = true;
        useGlobalCallOrder = 'setFromGlobalAfter';
        return next();
      }
    }

    class TestLoggerKoaMiddleware implements KoaMiddlewareInterface {
      public use(context: any, next?: Function): any {
        useCustom = true;
        return next();
      }
    }

    class TestCustomMiddlewareWhichThrows implements KoaMiddlewareInterface {
      public use(request: any, response: any, next?: Function): any {
        throw new NotAcceptableError('TestCustomMiddlewareWhichThrows');
      }
    }

    @Controller()
    class KoaMiddlewareController {
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
      @UseAfter(function(context: any, next: Function) {
        useAfter = true;
        useCallOrder = 'setFromUseAfter';
        return next();
      })
      public photos() {
        useCallOrder = 'setFromController';
        return '1234';
      }

      @Get('/posts')
      @UseBefore(function(context: any, next: Function) {
        useBefore = true;
        useCallOrder = 'setFromUseBefore';
        return next();
      })
      @UseAfter(function(context: any, next: Function) {
        useAfter = true;
        useCallOrder = 'setFromUseAfter';
        return next();
      })
      public posts() {
        useCallOrder = 'setFromController';
        return '1234';
      }

      @Get('/questions')
      @UseBefore(TestLoggerKoaMiddleware)
      public questions() {
        return '1234';
      }

      @Get('/users')
      @UseBefore(function(context: any, next: Function) {
        useBefore = true;
        useCallOrder = 'setFromUseBefore';
        return next();
      })
      public users() {
        useCallOrder = 'setFromController';
        return '1234';
      }
    }
  });

  let app: any;
  before(done => (app = createKoaServer().listen(3001, done)));
  after(done => app.close(done));

  it('should call a global middlewares', () =>
    chakram.get('http://127.0.0.1:3001/blogs').then((response: any) => {
      strictEqual(useGlobalBefore, true);
      strictEqual(useGlobalAfter, true);
      strictEqual(useGlobalCallOrder, 'setFromGlobalAfter');
      strictEqual(response.response.statusCode, 200);
    }));

  it('should use a custom middleware when @UseBefore or @UseAfter is used', () =>
    chakram.get('http://127.0.0.1:3001/questions').then((response: any) => {
      strictEqual(useCustom, true);
      strictEqual(response.response.statusCode, 200);
    }));

  it('should call middleware and call it before controller action when @UseBefore is used', () =>
    chakram.get('http://127.0.0.1:3001/users').then((response: any) => {
      strictEqual(useBefore, true);
      strictEqual(useCallOrder, 'setFromController');
      strictEqual(response.response.statusCode, 200);
    }));

  it('should call middleware and call it after controller action when @UseAfter is used', () =>
    chakram.get('http://127.0.0.1:3001/photos').then((response: any) => {
      strictEqual(useAfter, true);
      strictEqual(useCallOrder, 'setFromUseAfter');
      strictEqual(response.response.statusCode, 200);
    }));

  it('should call before middleware and call after middleware when @UseAfter and @UseAfter are used', () =>
    chakram.get('http://127.0.0.1:3001/posts').then((response: any) => {
      strictEqual(useBefore, true);
      strictEqual(useAfter, true);
      strictEqual(useCallOrder, 'setFromUseAfter');
      strictEqual(response.response.statusCode, 200);
    }));

  it('should handle errors in custom middlewares', () =>
    chakram.get('http://127.0.0.1:3001/customMiddlewareWichThrows').then((response: any) => {
      strictEqual(response.response.statusCode, 406);
    }));
});

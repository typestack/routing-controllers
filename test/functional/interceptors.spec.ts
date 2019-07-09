import 'reflect-metadata';
import {strictEqual} from 'assert';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';
import {InterceptorInterface} from '../../src/InterceptorInterface';
import {Interceptor} from '../../src/decorator/Interceptor';
import {UseInterceptor} from '../../src/decorator/UseInterceptor';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {Action} from '../../src/Action';

describe('interceptor', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Interceptor()
    class NumbersInterceptor implements InterceptorInterface {
      public intercept(action: Action, result: any): any {
        return result.replace(/[0-9]/gi, '');
      }
    }

    class ByeWordInterceptor implements InterceptorInterface {
      public intercept(action: Action, result: any): any {
        return result.replace(/bye/gi, 'hello');
      }
    }

    class BadWordsInterceptor implements InterceptorInterface {
      public intercept(action: Action, result: any): any {
        return result.replace(/damn/gi, '***');
      }
    }

    class AsyncInterceptor implements InterceptorInterface {
      public intercept(action: Action, result: any): any {
        return new Promise(ok => {
          setTimeout(() => {
            ok(result.replace(/hello/gi, 'bye'));
          }, 1000);
        });
      }
    }

    @Controller()
    @UseInterceptor(ByeWordInterceptor)
    class HandledController {
      @Get('/files')
      public files(): any {
        return '<html><body>hello1234567890 world</body></html>';
      }

      @Get('/users')
      @UseInterceptor((action: Action, result: any) => result.replace(/hello/gi, 'hello world'))
      public getUsers(): any {
        return '<html><body>damn hello</body></html>';
      }

      @Get('/photos')
      @UseInterceptor(AsyncInterceptor)
      public photos(): any {
        return '<html><body>hello world</body></html>';
      }

      @Get('/posts')
      @UseInterceptor(BadWordsInterceptor)
      public posts(): any {
        return '<html><body>this post contains damn bad words</body></html>';
      }

      @Get('/questions')
      public questions(): any {
        return '<html><body>bye world</body></html>';
      }
    }
  });

  let expressApp: any;
  let koaApp: any;
  before(done => (expressApp = createExpressServer().listen(3001, done)));
  after(done => expressApp.close(done));
  before(done => (koaApp = createKoaServer().listen(3002, done)));
  after(done => koaApp.close(done));

  describe('custom interceptor function should replace returned content', () => {
    assertRequest([3001, 3002], {uri: 'users'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>damn hello world</body></html>');
    });
  });

  describe('custom interceptor class should replace returned content', () => {
    assertRequest([3001, 3002], {uri: 'posts'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>this post contains *** bad words</body></html>');
    });
  });

  describe('custom interceptor class used on the whole controller should replace returned content', () => {
    assertRequest([3001, 3002], {uri: 'questions'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>hello world</body></html>');
    });
  });

  describe('global interceptor class should replace returned content', () => {
    assertRequest([3001, 3002], {uri: 'files'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>hello world</body></html>');
    });
  });

  describe('interceptors should support promises', () => {
    assertRequest([3001, 3002], {uri: 'photos'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>bye world</body></html>');
    });
  });
});

import 'reflect-metadata';
import {ok, strictEqual} from 'assert';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {Post} from '../../src/decorator/Post';
import {Method} from '../../src/decorator/Method';
import {Head} from '../../src/decorator/Head';
import {Delete} from '../../src/decorator/Delete';
import {Patch} from '../../src/decorator/Patch';
import {Put} from '../../src/decorator/Put';
import {ContentType} from '../../src/decorator/ContentType';
import {JsonController} from '../../src/decorator/JsonController';
import {UnauthorizedError} from '../../src/http-error/UnauthorizedError';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';

describe('controller methods', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Controller()
    class UserController {
      @Delete('/users')
      public delete() {
        return '<html><body>Removing user</body></html>';
      }

      @Get('/users')
      public getAll() {
        return '<html><body>All users</body></html>';
      }

      @Method('delete', '/categories')
      public getCategories() {
        return '<html><body>Get categories</body></html>';
      }

      @Get(/\/categories\/[\d+]/)
      public getCategoryById() {
        return '<html><body>One category</body></html>';
      }

      @Get('/posts/:id(\\d+)')
      public getPostById() {
        return '<html><body>One post</body></html>';
      }

      @Get('/posts-from-db')
      public getPostFromDb() {
        return new Promise((ok, fail) => {
          setTimeout(() => {
            ok('<html><body>resolved after half second</body></html>');
          }, 500);
        });
      }

      @Get('/posts-from-failed-db')
      public getPostFromFailedDb() {
        return new Promise((ok, fail) => {
          setTimeout(() => {
            fail('<html><body>cannot connect to a database</body></html>');
          }, 500);
        });
      }

      @Get('/users/:id')
      public getUserById() {
        return '<html><body>One user</body></html>';
      }

      @Head('/users')
      public head() {
        return '<html><body>Removing user</body></html>';
      }

      @Patch('/users')
      public patch() {
        return '<html><body>Patching user</body></html>';
      }

      @Post('/users')
      public post() {
        return '<html><body>Posting user</body></html>';
      }

      @Method('post', '/categories')
      public postCategories() {
        return '<html><body>Posting categories</body></html>';
      }

      @Put('/users')
      public put() {
        return '<html><body>Putting user</body></html>';
      }
    }

    @JsonController('/return/json')
    class ReturnJsonController {
      @Get('/null')
      public returnNull(): null {
        return null;
      }

      @Get('/undefined')
      public returnUndefined(): undefined {
        return undefined;
      }
    }

    @Controller('/return/normal')
    class ReturnNormalController {
      @Get('/null')
      public returnNull(): null {
        return null;
      }

      @Get('/undefined')
      public returnUndefined(): undefined {
        return undefined;
      }
    }

    @JsonController('/json-controller')
    class ContentTypeController {
      @Get('/json-error')
      public jsonError(): never {
        throw new UnauthorizedError();
      }

      @Get('/text-html')
      @ContentType('text/html')
      public returnHtml(): string {
        return '<html>Test</html>';
      }

      @Get('/text-plain')
      @ContentType('text/plain')
      public returnString(): string {
        return 'Test';
      }

      @Get('/text-plain-error')
      @ContentType('text/plain')
      public textError(): never {
        throw new UnauthorizedError();
      }
    }
  });

  let expressApp: any, koaApp: any;
  before(done => (expressApp = createExpressServer().listen(3001, done)));
  after(done => expressApp.close(done));
  before(done => (koaApp = createKoaServer().listen(3002, done)));
  after(done => koaApp.close(done));

  describe('get should respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'get', 'users', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>All users</body></html>');
    });
  });

  describe('post respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'post', 'users', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>Posting user</body></html>');
    });
  });

  describe('put respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'put', 'users', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>Putting user</body></html>');
    });
  });

  describe('patch respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'patch', 'users', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>Patching user</body></html>');
    });
  });

  describe('delete respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'delete', 'users', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>Removing user</body></html>');
    });
  });

  describe('head respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'head', 'users', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, void 0);
    });
  });

  describe('custom method (post) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'post', 'categories', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>Posting categories</body></html>');
    });
  });

  describe('custom method (delete) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'delete', 'categories', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>Get categories</body></html>');
    });
  });

  describe('route should work with parameter', () => {
    assertRequest([3001, 3002], 'get', 'users/umed', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>One user</body></html>');
    });
  });

  describe('route should work with regexp parameter', () => {
    assertRequest([3001, 3002], 'get', 'categories/1', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>One category</body></html>');
    });
  });

  describe('should respond with 404 when regexp does not match', () => {
    assertRequest([3001, 3002], 'get', 'categories/umed', response => {
      strictEqual(response.response.statusCode, 404);
    });
  });

  describe('route should work with string regexp parameter', () => {
    assertRequest([3001, 3002], 'get', 'posts/1', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>One post</body></html>');
    });
  });

  describe('should respond with 404 when regexp does not match', () => {
    assertRequest([3001, 3002], 'get', 'posts/U', response => {
      strictEqual(response.response.statusCode, 404);
    });
  });

  describe('should return result from a promise', () => {
    assertRequest([3001, 3002], 'get', 'posts-from-db', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>resolved after half second</body></html>');
    });
  });

  describe('should respond with 500 if promise failed', () => {
    assertRequest([3001, 3002], 'get', 'posts-from-failed-db', response => {
      strictEqual(response.response.statusCode, 500);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>cannot connect to a database</body></html>');
    });
  });

  describe('should respond with 204 No Content when null returned in action', () => {
    assertRequest([3001, 3002], 'get', 'return/normal/null', response => {
      strictEqual(response.response.statusCode, 204);
      strictEqual(response.response.headers['content-type'], void 0);
      strictEqual(response.body, void 0);
    });
    assertRequest([3001, 3002], 'get', 'return/json/null', response => {
      strictEqual(response.response.statusCode, 204);
      strictEqual(response.response.headers['content-type'], void 0);
      strictEqual(response.body, void 0);
    });
  });

  describe('should respond with 404 Not Found text when undefined returned in action', () => {
    assertRequest([3001, 3002], 'get', 'return/normal/undefined', response => {
      strictEqual(response.response.statusCode, 404);
      ok(response.response.headers['content-type'].match(/text/));
    });
  });

  describe('should respond with 404 Not Found JSON when undefined returned in action', () => {
    assertRequest([3001, 3002], 'get', 'return/json/undefined', response => {
      strictEqual(response.response.statusCode, 404);
      ok(response.response.headers['content-type'].match(/application\/json/));
    });
  });

  describe('should respond with 200 and text/html even in json controller`s method', () => {
    assertRequest([3001, 3002], 'get', 'json-controller/text-html', response => {
      strictEqual(response.response.statusCode, 200);
      ok(response.response.headers['content-type'].match(/text\/html/));
      strictEqual(response.body, '<html>Test</html>');
    });
  });

  describe('should respond with 200 and text/plain even in json controller`s method', () => {
    assertRequest([3001, 3002], 'get', 'json-controller/text-plain', response => {
      strictEqual(response.response.statusCode, 200);
      ok(response.response.headers['content-type'].match(/text\/plain/));
      strictEqual(response.body, 'Test');
    });
  });

  describe('should respond with 401 and text/html when UnauthorizedError throwed even in json controller`s method', () => {
    assertRequest([3001, 3002], 'get', 'json-controller/text-plain-error', response => {
      strictEqual(response.response.statusCode, 401);
      ok(response.response.headers['content-type'].match(/text\/plain/));
      strictEqual(typeof response.body, 'string');
      ok(response.body.match(/UnauthorizedError.HttpError/));
    });
  });

  describe('should respond with 401 and aplication/json when UnauthorizedError throwed in standard json controller`s method', () => {
    assertRequest([3001, 3002], 'get', 'json-controller/json-error', response => {
      strictEqual(response.response.statusCode, 401);
      ok(response.response.headers['content-type'].match(/application\/json/));
      strictEqual(typeof response.body, 'object');
      strictEqual(response.body.name, 'UnauthorizedError');
    });
  });
});

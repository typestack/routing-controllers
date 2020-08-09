import 'reflect-metadata';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Post } from '../../src/decorator/Post';
import { Method } from '../../src/decorator/Method';
import { Head } from '../../src/decorator/Head';
import { Delete } from '../../src/decorator/Delete';
import { Patch } from '../../src/decorator/Patch';
import { Put } from '../../src/decorator/Put';
import { All } from '../../src/decorator/All';
import { ContentType } from '../../src/decorator/ContentType';
import { JsonController } from '../../src/decorator/JsonController';
import { UnauthorizedError } from '../../src/http-error/UnauthorizedError';
import { createExpressServer, createKoaServer, getMetadataArgsStorage } from '../../src/index';
import { assertRequest } from './test-utils';
const chakram = require('chakram');
const expect = chakram.expect;

describe('controller methods', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Controller()
    class UserController {
      @Get('/users')
      getAll() {
        return '<html><body>All users</body></html>';
      }
      @Post('/users')
      post() {
        return '<html><body>Posting user</body></html>';
      }
      @Put('/users')
      put() {
        return '<html><body>Putting user</body></html>';
      }
      @Patch('/users')
      patch() {
        return '<html><body>Patching user</body></html>';
      }
      @Delete('/users')
      delete() {
        return '<html><body>Removing user</body></html>';
      }
      @Head('/users')
      head() {
        return '<html><body>Removing user</body></html>';
      }
      @All('/users/me')
      all() {
        return '<html><body>Current user</body></html>';
      }
      @Method('post', '/categories')
      postCategories() {
        return '<html><body>Posting categories</body></html>';
      }
      @Method('delete', '/categories')
      getCategories() {
        return '<html><body>Get categories</body></html>';
      }
      @Get('/users/:id')
      getUserById() {
        return '<html><body>One user</body></html>';
      }
      @Get(/\/categories\/[\d+]/)
      getCategoryById() {
        return '<html><body>One category</body></html>';
      }
      @Get('/posts/:id(\\d+)')
      getPostById() {
        return '<html><body>One post</body></html>';
      }
      @Get('/posts-from-db')
      getPostFromDb() {
        return new Promise((ok, fail) => {
          setTimeout(() => {
            ok('<html><body>resolved after half second</body></html>');
          }, 500);
        });
      }
      @Get('/posts-from-failed-db')
      getPostFromFailedDb() {
        return new Promise((ok, fail) => {
          setTimeout(() => {
            fail('<html><body>cannot connect to a database</body></html>');
          }, 500);
        });
      }
    }

    @JsonController('/return/json')
    class ReturnJsonController {
      @Get('/undefined')
      returnUndefined(): undefined {
        return undefined;
      }
      @Get('/null')
      returnNull(): null {
        return null;
      }
    }

    @Controller('/return/normal')
    class ReturnNormalController {
      @Get('/undefined')
      returnUndefined(): undefined {
        return undefined;
      }
      @Get('/null')
      returnNull(): null {
        return null;
      }
    }

    @JsonController('/json-controller')
    class ContentTypeController {
      @Get('/text-html')
      @ContentType('text/html')
      returnHtml(): string {
        return '<html>Test</html>';
      }

      @Get('/text-plain')
      @ContentType('text/plain')
      returnString(): string {
        return 'Test';
      }

      @Get('/text-plain-error')
      @ContentType('text/plain')
      textError(): never {
        throw new UnauthorizedError();
      }

      @Get('/json-error')
      jsonError(): never {
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
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>All users</body></html>');
    });
  });

  describe('post respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'post', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>Posting user</body></html>');
    });
  });

  describe('put respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'put', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>Putting user</body></html>');
    });
  });

  describe('patch respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'patch', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>Patching user</body></html>');
    });
  });

  describe('delete respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'delete', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>Removing user</body></html>');
    });
  });

  describe('head respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'head', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.undefined;
    });
  });

  describe('all respond with proper status code, headers and body content', () => {
    const callback = (response: any) => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>Current user</body></html>');
    };

    assertRequest([3001, 3002], 'get', 'users/me', callback);
    assertRequest([3001, 3002], 'put', 'users/me', callback);
    assertRequest([3001, 3002], 'patch', 'users/me', callback);
    assertRequest([3001, 3002], 'delete', 'users/me', callback);
  });

  describe('custom method (post) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'post', 'categories', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>Posting categories</body></html>');
    });
  });

  describe('custom method (delete) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'delete', 'categories', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>Get categories</body></html>');
    });
  });

  describe('route should work with parameter', () => {
    assertRequest([3001, 3002], 'get', 'users/umed', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>One user</body></html>');
    });
  });

  describe('route should work with regexp parameter', () => {
    assertRequest([3001, 3002], 'get', 'categories/1', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>One category</body></html>');
    });
  });

  describe('should respond with 404 when regexp does not match', () => {
    assertRequest([3001, 3002], 'get', 'categories/umed', response => {
      expect(response).to.have.status(404);
    });
  });

  describe('route should work with string regexp parameter', () => {
    assertRequest([3001, 3002], 'get', 'posts/1', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>One post</body></html>');
    });
  });

  describe('should respond with 404 when regexp does not match', () => {
    assertRequest([3001, 3002], 'get', 'posts/U', response => {
      expect(response).to.have.status(404);
    });
  });

  describe('should return result from a promise', () => {
    assertRequest([3001, 3002], 'get', 'posts-from-db', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>resolved after half second</body></html>');
    });
  });

  describe('should respond with 500 if promise failed', () => {
    assertRequest([3001, 3002], 'get', 'posts-from-failed-db', response => {
      expect(response).to.have.status(500);
      expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
      expect(response.body).to.be.equal('<html><body>cannot connect to a database</body></html>');
    });
  });

  describe('should respond with 204 No Content when null returned in action', () => {
    assertRequest([3001, 3002], 'get', 'return/normal/null', response => {
      expect(response).to.have.status(204);
      expect(response).to.not.have.header('content-type');
      expect(response.body).to.not.exist;
    });
    assertRequest([3001, 3002], 'get', 'return/json/null', response => {
      expect(response).to.have.status(204);
      expect(response).to.not.have.header('content-type');
      expect(response.body).to.not.exist;
    });
  });

  describe('should respond with 404 Not Found text when undefined returned in action', () => {
    assertRequest([3001, 3002], 'get', 'return/normal/undefined', response => {
      expect(response).to.have.status(404);
      expect(response).to.have.header('content-type', (contentType: string) => {
        expect(contentType).to.match(/text/);
      });
    });
  });

  describe('should respond with 404 Not Found JSON when undefined returned in action', () => {
    assertRequest([3001, 3002], 'get', 'return/json/undefined', response => {
      expect(response).to.have.status(404);
      expect(response).to.have.header('content-type', (contentType: string) => {
        expect(contentType).to.match(/application\/json/);
      });
    });
  });

  describe("should respond with 200 and text/html even in json controller's method", () => {
    assertRequest([3001, 3002], 'get', 'json-controller/text-html', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', (contentType: string) => {
        expect(contentType).to.match(/text\/html/);
      });
      expect(response.body).to.equals('<html>Test</html>');
    });
  });

  describe("should respond with 200 and text/plain even in json controller's method", () => {
    assertRequest([3001, 3002], 'get', 'json-controller/text-plain', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', (contentType: string) => {
        expect(contentType).to.match(/text\/plain/);
      });
      expect(response.body).to.equals('Test');
    });
  });

  describe("should respond with 401 and text/html when UnauthorizedError throwed even in json controller's method", () => {
    assertRequest([3001, 3002], 'get', 'json-controller/text-plain-error', response => {
      expect(response).to.have.status(401);
      expect(response).to.have.header('content-type', (contentType: string) => {
        expect(contentType).to.match(/text\/plain/);
      });
      expect(typeof response.body).to.equals('string');
      expect(response.body).to.match(/UnauthorizedError.HttpError/);
    });
  });

  describe("should respond with 401 and aplication/json when UnauthorizedError throwed in standard json controller's method", () => {
    assertRequest([3001, 3002], 'get', 'json-controller/json-error', response => {
      expect(response).to.have.status(401);
      expect(response).to.have.header('content-type', (contentType: string) => {
        expect(contentType).to.match(/application\/json/);
      });
      expect(typeof response.body).to.equals('object');
      expect(response.body.name).to.equals('UnauthorizedError');
    });
  });
});

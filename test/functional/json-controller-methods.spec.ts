import 'reflect-metadata';
import {strictEqual, deepStrictEqual, ok} from 'assert';
import {JsonController} from '../../src/decorator/JsonController';
import {Get} from '../../src/decorator/Get';
import {Post} from '../../src/decorator/Post';
import {Method} from '../../src/decorator/Method';
import {Head} from '../../src/decorator/Head';
import {Delete} from '../../src/decorator/Delete';
import {Patch} from '../../src/decorator/Patch';
import {Put} from '../../src/decorator/Put';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';

describe('json-controller methods', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class JsonUserController {
      @Delete('/users')
      public delete() {
        return {
          status: 'removed',
        };
      }
      @Get('/users')
      public getAll() {
        return [
          {
            id: 1,
            name: 'Umed',
          },
          {
            id: 2,
            name: 'Bakha',
          },
        ];
      }
      @Method('delete', '/categories')
      public getCategories() {
        return {
          status: 'removed',
        };
      }
      @Get(/\/categories\/[\d+]/)
      public getCategoryById() {
        return {
          id: 1,
          name: 'People',
        };
      }
      @Get('/posts/:id(\\d+)')
      public getPostById() {
        return {
          id: 1,
          title: 'About People',
        };
      }
      @Get('/posts-from-db')
      public getPostFromDb() {
        return new Promise((ok, fail) => {
          setTimeout(() => {
            ok({
              id: 1,
              title: 'Hello database post',
            });
          }, 500);
        });
      }
      @Get('/posts-from-failed-db')
      public getPostFromFailedDb() {
        return new Promise((ok, fail) => {
          setTimeout(() => {
            fail({
              code: 10954,
              message: 'Cannot connect to db',
            });
          }, 500);
        });
      }
      @Get('/users/:id')
      public getUserById() {
        return {
          id: 1,
          name: 'Umed',
        };
      }
      @Head('/users')
      public head() {
        return {
          thisWillNot: 'beSent',
        };
      }
      @Patch('/users')
      public patch() {
        return {
          status: 'patched',
        };
      }
      @Post('/users')
      public post() {
        return {
          status: 'saved',
        };
      }
      @Method('post', '/categories')
      public postCategories() {
        return {
          status: 'posted',
        };
      }
      @Put('/users')
      public put() {
        return {
          status: 'updated',
        };
      }
    }
  });

  let expressApp: any, koaApp: any;
  before(done => (expressApp = createExpressServer().listen(3001, done)));
  after(done => expressApp.close(done));
  before(done => (koaApp = createKoaServer().listen(3002, done)));
  after(done => koaApp.close(done));

  describe('get should respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'users'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      ok(response.body instanceof Array);
      deepStrictEqual(response.body, [
        {
          id: 1,
          name: 'Umed',
        },
        {
          id: 2,
          name: 'Bakha',
        },
      ]);
    });
  });

  describe('post respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'users', method: 'post'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        status: 'saved',
      });
    });
  });

  describe('put respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'users', method: 'put'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        status: 'updated',
      });
    });
  });

  describe('patch respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'users', method: 'patch'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        status: 'patched',
      });
    });
  });

  describe('delete respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'users', method: 'delete'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        status: 'removed',
      });
    });
  });

  describe('head respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'users', method: 'head'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      strictEqual(response.body, void 0);
    });
  });

  describe('custom method (post) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'categories', method: 'post'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        status: 'posted',
      });
    });
  });

  describe('custom method (delete) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], {uri: 'categories', method: 'delete'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        status: 'removed',
      });
    });
  });

  describe('route should work with parameter', () => {
    assertRequest([3001, 3002], {uri: 'users/umed'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        id: 1,
        name: 'Umed',
      });
    });
  });

  describe('route should work with regexp parameter', () => {
    assertRequest([3001, 3002], {uri: 'categories/1'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        id: 1,
        name: 'People',
      });
    });
  });

  describe('should respond with 404 when regexp does not match', () => {
    assertRequest([3001, 3002], {uri: 'categories/umed'}, response => {
      strictEqual(response.statusCode, 404);
    });
  });

  describe('route should work with string regexp parameter', () => {
    assertRequest([3001, 3002], {uri: 'posts/1'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        id: 1,
        title: 'About People',
      });
    });
  });

  describe('should respond with 404 when regexp does not match', () => {
    assertRequest([3001, 3002], {uri: 'posts/U'}, response => {
      strictEqual(response.statusCode, 404);
    });
  });

  describe('should return result from a promise', () => {
    assertRequest([3001, 3002], {uri: 'posts-from-db'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        id: 1,
        title: 'Hello database post',
      });
    });
  });

  describe('should respond with 500 if promise failed', () => {
    assertRequest([3001, 3002], {uri: 'posts-from-failed-db'}, response => {
      strictEqual(response.statusCode, 500);
      strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, {
        code: 10954,
        message: 'Cannot connect to db',
      });
    });
  });
});

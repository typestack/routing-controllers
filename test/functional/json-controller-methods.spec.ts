import 'reflect-metadata';
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
const chakram = require('chakram');
const expect = chakram.expect;

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
    assertRequest([3001, 3002], 'get', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.be.eql([
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
    assertRequest([3001, 3002], 'post', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        status: 'saved',
      });
    });
  });

  describe('put respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'put', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        status: 'updated',
      });
    });
  });

  describe('patch respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'patch', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        status: 'patched',
      });
    });
  });

  describe('delete respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'delete', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        status: 'removed',
      });
    });
  });

  describe('head respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'head', 'users', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.undefined;
    });
  });

  describe('custom method (post) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'post', 'categories', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        status: 'posted',
      });
    });
  });

  describe('custom method (delete) respond with proper status code, headers and body content', () => {
    assertRequest([3001, 3002], 'delete', 'categories', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        status: 'removed',
      });
    });
  });

  describe('route should work with parameter', () => {
    assertRequest([3001, 3002], 'get', 'users/umed', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        id: 1,
        name: 'Umed',
      });
    });
  });

  describe('route should work with regexp parameter', () => {
    assertRequest([3001, 3002], 'get', 'categories/1', response => {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        id: 1,
        name: 'People',
      });
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
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        id: 1,
        title: 'About People',
      });
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
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        id: 1,
        title: 'Hello database post',
      });
    });
  });

  describe('should respond with 500 if promise failed', () => {
    assertRequest([3001, 3002], 'get', 'posts-from-failed-db', response => {
      expect(response).to.have.status(500);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      expect(response.body).to.be.eql({
        code: 10954,
        message: 'Cannot connect to db',
      });
    });
  });
});

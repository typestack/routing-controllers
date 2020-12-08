import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { ContentType } from '../../src/decorator/ContentType';
import { Controller } from '../../src/decorator/Controller';
import { Delete } from '../../src/decorator/Delete';
import { Get } from '../../src/decorator/Get';
import { Head } from '../../src/decorator/Head';
import { JsonController } from '../../src/decorator/JsonController';
import { Method } from '../../src/decorator/Method';
import { Patch } from '../../src/decorator/Patch';
import { Post } from '../../src/decorator/Post';
import { Put } from '../../src/decorator/Put';
import { UnauthorizedError } from '../../src/http-error/UnauthorizedError';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;


describe(``, () => {
  let expressServer: HttpServer;

  describe('controller methods', () => {

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller()
      class UserController {
        @Get('/users')
        getAll(): string {
          return '<html><body>All users</body></html>';
        }

        @Post('/users')
        post(): string {
          return '<html><body>Posting user</body></html>';
        }

        @Put('/users')
        put(): string {
          return '<html><body>Putting user</body></html>';
        }

        @Patch('/users')
        patch(): string {
          return '<html><body>Patching user</body></html>';
        }

        @Delete('/users')
        delete(): string {
          return '<html><body>Removing user</body></html>';
        }

        @Head('/users')
        head(): string {
          return '<html><body>Removing user</body></html>';
        }

        @Method('post', '/categories')
        postCategories(): string {
          return '<html><body>Posting categories</body></html>';
        }

        @Method('delete', '/categories')
        getCategories(): string {
          return '<html><body>Get categories</body></html>';
        }

        @Get('/users/:id')
        getUserById(): string {
          return '<html><body>One user</body></html>';
        }

        @Get(/\/categories\/[\d+]/)
        getCategoryById(): string {
          return '<html><body>One category</body></html>';
        }

        @Get('/posts/:id(\\d+)')
        getPostById(): string {
          return '<html><body>One post</body></html>';
        }

        @Get('/posts-from-db')
        getPostFromDb(): Promise<string> {
          return new Promise((ok, fail) => {
            setTimeout(() => {
              ok('<html><body>resolved after half second</body></html>');
            }, 500);
          });
        }

        @Get('/posts-from-failed-db')
        getPostFromFailedDb(): Promise<string> {
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

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it('get should respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.get('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>All users</body></html>');
    });

    it('post respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.post('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Posting user</body></html>');
    });

    it('put respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.put('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Putting user</body></html>');
    });

    it('patch respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.patch('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Patching user</body></html>');
    });

    it('delete respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.delete('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Removing user</body></html>');
    });

    it('head respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.head('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('');
    });

    it('custom method (post) respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.post('/categories');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Posting categories</body></html>');
    });

    it('custom method (delete) respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.delete('/categories');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Get categories</body></html>');
    });

    it('route should work with parameter', async () => {
      expect.assertions(3);
      const response = await axios.get('/users/umed');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>One user</body></html>');
    });

    it('route should work with regexp parameter', async () => {
      const response = await axios.get('/categories/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>One category</body></html>');
    });

    it('should respond with 404 when regexp does not match', async () => {
      expect.assertions(1);
      try {
        await axios.get('/categories/umed');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('route should work with string regexp parameter', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>One post</body></html>');
    });

    it('should respond with 404 when regexp does not match', async () => {
      expect.assertions(1);
      try {
        await axios.get('/posts/U');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      };
    });

    it('should return result from a promise', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts-from-db');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>resolved after half second</body></html>');
    });

    it('should respond with 500 if promise failed', async () => {
      expect.assertions(3);
      try {
        await axios.get('/posts-from-failed-db');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(error.response.headers['content-type']).toEqual('text/html; charset=utf-8');
        expect(error.response.data).toEqual('<html><body>cannot connect to a database</body></html>');
      };
    });

    it('should respond with 204 No Content when null returned in action', async () => {
      expect.assertions(6);

      let response = await axios.get('/return/normal/null');
      expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
      expect(response.headers['content-type']).toBeUndefined();
      expect(response.data).toEqual('');

      response = await axios.get('/return/json/null');
      expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
      expect(response.headers['content-type']).toBeUndefined();
      expect(response.data).toEqual('');
    });

    it('should respond with 404 Not Found text when undefined returned in action', async () => {
      expect.assertions(2);
      try {
        await axios.get('/return/normal/undefined')
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
        expect(error.response.headers['content-type']).toEqual('text/html; charset=utf-8');
      };
    });

    it('should respond with 404 Not Found JSON when undefined returned in action', async () => {
      expect.assertions(2);
      try {
        await axios.get('/return/json/undefined');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
        expect(error.response.headers['content-type']).toEqual('application/json; charset=utf-8');
      };
    });

    it("should respond with 200 and text/html even in json controller's method", async () => {
      expect.assertions(3);
      const response = await axios.get('/json-controller/text-html');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html>Test</html>');
    });

    it("should respond with 200 and text/plain even in json controller's method", async () => {
      expect.assertions(3);
      const response = await axios.get('/json-controller/text-plain');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/plain; charset=utf-8');
      expect(response.data).toEqual('Test');
    });

    it("should respond with 401 and text/html when UnauthorizedError throwed even in json controller's method", async () => {
      expect.assertions(4);
      try {
        await axios.get('/json-controller/text-plain-error');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
        expect(error.response.headers['content-type']).toEqual('text/plain; charset=utf-8');
        expect(typeof error.response.data).toEqual('string');
        expect(error.response.data).toMatch(/UnauthorizedError/);
      };
    });

    it("should respond with 401 and aplication/json when UnauthorizedError is thrown in standard json controller's method", async () => {
      expect.assertions(4);
      try {
        await axios.get('/json-controller/json-error');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
        expect(error.response.headers['content-type']).toEqual('application/json; charset=utf-8');
        expect(typeof error.response.data).toEqual('object');
        expect(error.response.data.name).toEqual('UnauthorizedError');
      };
    });
  });
});
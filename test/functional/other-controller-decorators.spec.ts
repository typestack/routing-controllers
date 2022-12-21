import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Action } from '../../src/Action';
import { ContentType } from '../../src/decorator/ContentType';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Header } from '../../src/decorator/Header';
import { HttpCode } from '../../src/decorator/HttpCode';
import { JsonController } from '../../src/decorator/JsonController';
import { Location } from '../../src/decorator/Location';
import { OnUndefined } from '../../src/decorator/OnUndefined';
import { Param } from '../../src/decorator/Param';
import { Post } from '../../src/decorator/Post';
import { Redirect } from '../../src/decorator/Redirect';
import { HttpError } from '../../src/http-error/HttpError';
import { createExpressServer, getMetadataArgsStorage, OnNull } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('other controller decorators', () => {
    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      class QuestionNotFoundError extends HttpError {
        constructor(action: Action) {
          super(404, `Question was not found!`);
          Object.setPrototypeOf(this, QuestionNotFoundError.prototype);
        }
      }

      @Controller()
      class OtherDectoratorsController {
        @Post('/users')
        @HttpCode(201)
        getUsers(): string {
          return '<html><body>User has been created</body></html>';
        }

        @Get('/admin')
        @HttpCode(403)
        getAdmin(): string {
          return '<html><body>Access is denied</body></html>';
        }

        @Get('/posts/:id')
        @OnNull(404)
        getPost(@Param('id') id: number): Promise<string> {
          return new Promise((ok, fail) => {
            if (id === 1) {
              ok('Post');
            } else if (id === 2) {
              ok('');
            } else if (id === 3) {
              ok(null);
            } else {
              ok(undefined);
            }
          });
        }

        @Get('/photos/:id')
        @OnUndefined(201)
        getPhoto(@Param('id') id: number): Promise<string> {
          if (id === 4) {
            return undefined;
          }

          return new Promise((ok, fail) => {
            if (id === 1) {
              ok('Photo');
            } else if (id === 2) {
              ok('');
            } else if (id === 3) {
              ok(null);
            } else {
              ok(undefined);
            }
          });
        }

        @Get('/homepage')
        @ContentType('text/html; charset=utf-8')
        getHomepage(): string {
          return '<html><body>Hello world</body></html>';
        }

        @Get('/textpage')
        @ContentType('text/plain; charset=utf-8')
        getTextpage(): string {
          return 'Hello text';
        }

        @Get('/userdash')
        @Header('authorization', 'Barer abcdefg')
        @Header('development-mode', 'enabled')
        getUserdash(): string {
          return '<html><body>Hello, User</body></html>';
        }

        @Get('/github')
        @Location('http://github.com')
        getToGithub(): string {
          return '<html><body>Hello, github</body></html>';
        }

        @Get('/github-redirect')
        @Redirect('http://github.com')
        goToGithub(): string {
          // todo: need test for this one
          return '<html><body>Hello, github</body></html>';
        }
      }

      @JsonController()
      class JsonOtherDectoratorsController {
        @Get('/questions/:id')
        @OnUndefined(QuestionNotFoundError)
        getPosts(@Param('id') id: number): Promise<string> {
          return new Promise((ok, fail) => {
            if (id === 1) {
              ok('Question');
            } else {
              ok(undefined);
            }
          });
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done);
    });

    it('should return httpCode set by @HttpCode decorator', async () => {
      expect.assertions(4);

      const response = await axios.post('/users', { name: 'Umed' });
      expect(response.status).toEqual(HttpStatusCodes.CREATED);
      expect(response.data).toEqual('<html><body>User has been created</body></html>');

      try {
        await axios.get('/admin');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.FORBIDDEN);
        expect(error.response.data).toEqual('<html><body>Access is denied</body></html>');
      }
    });

    it('should return custom code when @OnNull', async () => {
      expect.assertions(6);
      let response = await axios.get('/posts/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual('Post');

      response = await axios.get('/posts/2');
      expect(response.status).toEqual(HttpStatusCodes.OK);

      try {
        await axios.get('/posts/3');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }

      try {
        await axios.get('/posts/4');
      } catch (error) {
        // this is expected because for undefined 404 is given by default
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }

      try {
        await axios.get('/posts/5');
      } catch (error) {
        // this is expected because for undefined 404 is given by default
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('should return custom error message and code when @OnUndefined is used with Error class', async () => {
      expect.assertions(8);
      let response = await axios.get('/questions/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual('Question');

      try {
        await axios.get('/questions/2');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
        expect(error.response.data.name).toEqual('QuestionNotFoundError');
        expect(error.response.data.message).toEqual('Question was not found!');
      }

      try {
        await axios.get('/questions/3');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
        expect(error.response.data.name).toEqual('QuestionNotFoundError');
        expect(error.response.data.message).toEqual('Question was not found!');
      }
    });

    it('should return custom code when @OnUndefined', async () => {
      expect.assertions(6);
      let response = await axios.get('/photos/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual('Photo');

      response = await axios.get('/photos/2');
      expect(response.status).toEqual(HttpStatusCodes.OK);

      response = await axios.get('/photos/3');
      expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);

      response = await axios.get('/photos/4');
      expect(response.status).toEqual(HttpStatusCodes.CREATED);

      response = await axios.get('/photos/5');
      expect(response.status).toEqual(HttpStatusCodes.CREATED);
    });

    it('should return content-type in the response when @ContentType is used', async () => {
      expect.assertions(3);
      const response = await axios.get('/homepage');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Hello world</body></html>');
    });

    it('should return content-type in the response when @ContentType is used', async () => {
      expect.assertions(3);
      const response = await axios.get('/textpage');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/plain; charset=utf-8');
      expect(response.data).toEqual('Hello text');
    });

    it('should return response with custom headers when @Header is used', async () => {
      expect.assertions(4);
      const response = await axios.get('/userdash');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['authorization']).toEqual('Barer abcdefg');
      expect(response.headers['development-mode']).toEqual('enabled');
      expect(response.data).toEqual('<html><body>Hello, User</body></html>');
    });

    it('should relocate to new location when @Location is used', async () => {
      expect.assertions(2);
      const response = await axios.get('/github');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['location']).toEqual('http://github.com');
    });
  });
});

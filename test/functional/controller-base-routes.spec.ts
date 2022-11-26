import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('controller > base routes functionality', () => {
    beforeEach((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller('/posts')
      class PostController {
        @Get('/')
        getAll(): string {
          return '<html><body>All posts</body></html>';
        }

        @Get('/:id(\\d+)')
        getUserById(): string {
          return '<html><body>One post</body></html>';
        }

        @Get(/\/categories\/(\d+)/)
        getCategoryById(): string {
          return '<html><body>One post category</body></html>';
        }

        @Get('/:postId(\\d+)/users/:userId(\\d+)')
        getPostById(): string {
          return '<html><body>One user</body></html>';
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('get should respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>All posts</body></html>');
    });

    it('get should respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>One post</body></html>');
    });

    it('get should respond with proper status code, headers and body content - 2nd pass', async () => {
      expect.assertions(3);
      const response = await axios.get('posts/1/users/2');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>One user</body></html>');
    });

    it('wrong route should respond with 404 error', async () => {
      expect.assertions(1);
      try {
        await axios.get('/1/users/1');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('wrong route should respond with 404 error', async () => {
      expect.assertions(1);
      try {
        await axios.get('/categories/1');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('wrong route should respond with 404 error', async () => {
      expect.assertions(1);
      try {
        await axios.get('/users/1');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });
  });
});

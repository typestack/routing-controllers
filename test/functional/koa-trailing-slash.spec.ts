import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { createKoaServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let koaServer: HttpServer;

  describe('koa trailing slashes', () => {
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

      koaServer = createKoaServer().listen(3001, done)
    });

    afterEach((done: DoneCallback) => {
      koaServer.close(done);
    });

    it('get should respond to request without a traling slash', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>All posts</body></html>');
    });

    it('get should respond to request with a traling slash', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts/');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>All posts</body></html>');
    });
  });
});

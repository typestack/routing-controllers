import HttpStatusCodes from 'http-status-codes';
import { Delete } from '../../src/decorator/Delete';
import { Get } from '../../src/decorator/Get';
import { Head } from '../../src/decorator/Head';
import { JsonController } from '../../src/decorator/JsonController';
import { Method } from '../../src/decorator/Method';
import { Patch } from '../../src/decorator/Patch';
import { Post } from '../../src/decorator/Post';
import { Put } from '../../src/decorator/Put';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';

describe(``, () => {
  let expressServer: any;

  describe('json-controller methods', () => {
    beforeAll(done => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class JsonUserController {
        @Get('/users')
        getAll() {
          return [
            { id: 1, name: 'Umed' },
            { id: 2, name: 'Bakha' },
          ];
        }

        @Post('/users')
        post() {
          return {
            status: 'saved',
          };
        }
        @Put('/users')
        put() {
          return {
            status: 'updated',
          };
        }
        @Patch('/users')
        patch() {
          return {
            status: 'patched',
          };
        }
        @Delete('/users')
        delete() {
          return {
            status: 'removed',
          };
        }
        @Head('/users')
        head() {
          return {
            thisWillNot: 'beSent',
          };
        }
        @Method('post', '/categories')
        postCategories() {
          return {
            status: 'posted',
          };
        }
        @Method('delete', '/categories')
        getCategories() {
          return {
            status: 'removed',
          };
        }
        @Get('/users/:id')
        getUserById() {
          return {
            id: 1,
            name: 'Umed',
          };
        }
        @Get(/\/categories\/[\d+]/)
        getCategoryById() {
          return {
            id: 1,
            name: 'People',
          };
        }
        @Get('/posts/:id(\\d+)')
        getPostById() {
          return {
            id: 1,
            title: 'About People',
          };
        }
        @Get('/posts-from-db')
        getPostFromDb() {
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
        getPostFromFailedDb() {
          return new Promise((ok, fail) => {
            setTimeout(() => {
              fail({
                code: 10954,
                message: 'Cannot connect to db',
              });
            }, 500);
          });
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll(done => {
      expressServer.close(done)
    });

    it('get should respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.get('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual([
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

    it('post respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.post('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'saved',
      });
    });

    it('put respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.put('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'updated',
      });
    });

    it('patch respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.patch('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'patched',
      });
    });

    it('delete respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.delete('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'removed',
      });
    });

    it('head respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.head('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toBe('');
    });

    it('custom method (post) respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.post('/categories');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'posted',
      });
    });

    it('custom method (delete) respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.delete('/categories');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'removed',
      });
    });

    it('route should work with parameter', async () => {
      expect.assertions(3);
      const response = await axios.get('/users/umed');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        name: 'Umed',
      });
    });

    it('route should work with regexp parameter', async () => {
      expect.assertions(3);
      const response = await axios.get('/categories/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        name: 'People',
      });
    });

    it('should respond with 404 when regexp does not match', async () => {
      expect.assertions(1);
      try {
        await axios.get('/categories/b1');
      } catch (err) {
        expect(err.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('route should work with string regexp parameter', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        title: 'About People',
      });
    });

    it('should respond with 404 when regexp does not match', async () => {
      expect.assertions(1);
      try {
        await axios.get('/posts/U');
      } catch (err) {
        expect(err.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('should return result from a promise', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts-from-db');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        title: 'Hello database post',
      });
    });

    it('should respond with 500 if promise failed', async () => {
      expect.assertions(3);
      try {
        await axios.get('/posts-from-failed-db');
      } catch (err) {
        expect(err.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(err.response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(err.response.data).toEqual({
          code: 10954,
          message: 'Cannot connect to db',
        });
      }
    });
  });
});

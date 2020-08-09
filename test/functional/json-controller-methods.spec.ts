import 'reflect-metadata';
import { JsonController } from '../../src/decorator/JsonController';
import { Get } from '../../src/decorator/Get';
import { Post } from '../../src/decorator/Post';
import { Method } from '../../src/decorator/Method';
import { Head } from '../../src/decorator/Head';
import { Delete } from '../../src/decorator/Delete';
import { Patch } from '../../src/decorator/Patch';
import { Put } from '../../src/decorator/Put';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { AxiosError, AxiosResponse } from 'axios';
import { axios } from '../utilities/axios';
import HttpStatusCodes from 'http-status-codes';

describe('json-controller methods', () => {
  let expressApp: any;

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

    expressApp = createExpressServer().listen(3001, done);
  });

  afterAll(done => expressApp.close(done));

  it('get should respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.get('users').then((response: AxiosResponse) => {
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
  });

  it('post respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.post('users').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'saved',
      });
    });
  });

  it('put respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.put('users').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'updated',
      });
    });
  });

  it('patch respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.patch('users').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'patched',
      });
    });
  });

  it('delete respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.delete('users').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'removed',
      });
    });
  });

  it('head respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.head('users').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toBeUndefined();
    });
  });

  it('custom method (post) respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.post('categories').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'posted',
      });
    });
  });

  it('custom method (delete) respond with proper status code, headers and body content', () => {
    expect.assertions(3);
    return axios.delete('categories').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        status: 'removed',
      });
    });
  });

  it('route should work with parameter', () => {
    expect.assertions(3);
    return axios.get('users/umed').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        name: 'Umed',
      });
    });
  });

  it('route should work with regexp parameter', () => {
    expect.assertions(3);
    return axios.get('categories/1').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        name: 'People',
      });
    });
  });

  it('should respond with 404 when regexp does not match', () => {
    expect.assertions(1);
    return axios.get('categories/1').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.NOT_FOUND);
    });
  });

  it('route should work with string regexp parameter', () => {
    expect.assertions(3);
    return axios.get('posts/1').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        title: 'About People',
      });
    });
  });

  it('should respond with 404 when regexp does not match', () => {
    expect.assertions(1);
    return axios.get('posts/U').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.NOT_FOUND);
    });
  });

  it('should return result from a promise', () => {
    expect.assertions(3);
    return axios.get('posts-from-db').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        id: 1,
        title: 'Hello database post',
      });
    });
  });

  it('should respond with 500 if promise failed', () => {
    expect.assertions(3);
    return axios.get('posts-from-failed-db').catch((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
      expect(response.data).toEqual({
        code: 10954,
        message: 'Cannot connect to db',
      });
    });
  });
});

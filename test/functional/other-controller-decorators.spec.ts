import 'reflect-metadata';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Param } from '../../src/decorator/Param';
import { Post } from '../../src/decorator/Post';
import { createExpressServer, getMetadataArgsStorage, OnNull } from '../../src/index';
import { HttpCode } from '../../src/decorator/HttpCode';
import { ContentType } from '../../src/decorator/ContentType';
import { Header } from '../../src/decorator/Header';
import { Redirect } from '../../src/decorator/Redirect';
import { Location } from '../../src/decorator/Location';
import { OnUndefined } from '../../src/decorator/OnUndefined';
import { HttpError } from '../../src/http-error/HttpError';
import { Action } from '../../src/Action';
import { JsonController } from '../../src/decorator/JsonController';
import { AxiosError, AxiosResponse } from 'axios';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import DoneCallback = jest.DoneCallback;
import { axios } from '../utilities/axios';

describe('other controller decorators', () => {
  let expressServer: HttpServer;

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

  afterAll((done: DoneCallback) => expressServer.close(done));

  it('should return httpCode set by @HttpCode decorator', () => {
    expect.assertions(4);
    return Promise.all<AxiosResponse | void>([
      axios
        .post('/users', {
          name: 'Umed',
        })
        .then((response: AxiosResponse) => {
          expect(response.status).toEqual(HttpStatusCodes.CREATED);
          expect(response.data).toEqual('<html><body>User has been created</body></html>');
        }),
      axios.get('/admin').catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.FORBIDDEN);
        expect(error.response.data).toEqual('<html><body>Access is denied</body></html>');
      }),
    ]);
  });

  it('should return custom code when @OnNull', () => {
    expect.assertions(6);
    return Promise.all<AxiosResponse | void>([
      axios.get('/posts/1').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.data).toEqual('Post');
      }),
      axios.get('/posts/2').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
      }),
      axios.get('/posts/3').catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }),
      axios.get('/posts/4').catch((error: AxiosError) => {
        // this is expected because for undefined 404 is given by default
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }),
      axios.get('/posts/5').catch((error: AxiosError) => {
        // this is expected because for undefined 404 is given by default
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }),
    ]);
  });

  it('should return custom error message and code when @OnUndefined is used with Error class', () => {
    expect.assertions(8);
    return Promise.all<AxiosResponse | void>([
      axios.get('/questions/1').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.data).toEqual('Question');
      }),
      axios.get('/questions/2').catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
        expect(error.response.data.name).toEqual('QuestionNotFoundError');
        expect(error.response.data.message).toEqual('Question was not found!');
      }),
      axios.get('/questions/3').catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
        expect(error.response.data.name).toEqual('QuestionNotFoundError');
        expect(error.response.data.message).toEqual('Question was not found!');
      }),
    ]);
  });

  it('should return custom code when @OnUndefined', () => {
    expect.assertions(6);
    return Promise.all<AxiosResponse | void>([
      axios.get('/photos/1').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.data).toEqual('Photo');
      }),
      axios.get('/photos/2').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
      }),
      axios.get('/photos/3').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
      }),
      axios.get('/photos/4').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.CREATED);
      }),
      axios.get('/photos/5').then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.CREATED);
      }),
    ]);
  });

  it('should return content-type in the response when @ContentType is used', () => {
    expect.assertions(3);
    return axios.get('/homepage').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>Hello world</body></html>');
    });
  });

  it('should return content-type in the response when @ContentType is used', () => {
    expect.assertions(3);
    return axios.get('/textpage').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/plain; charset=utf-8');
      expect(response.data).toEqual('Hello text');
    });
  });

  it('should return response with custom headers when @Header is used', () => {
    expect.assertions(4);
    return axios.get('/userdash').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['authorization']).toEqual('Barer abcdefg');
      expect(response.headers['development-mode']).toEqual('enabled');
      expect(response.data).toEqual('<html><body>Hello, User</body></html>');
    });
  });

  it('should relocate to new location when @Location is used', () => {
    expect.assertions(2);
    return axios.get('/github').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['location']).toEqual('http://github.com');
    });
  });
});

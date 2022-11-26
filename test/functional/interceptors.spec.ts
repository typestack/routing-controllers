import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Action } from '../../src/Action';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Interceptor } from '../../src/decorator/Interceptor';
import { UseInterceptor } from '../../src/decorator/UseInterceptor';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { InterceptorInterface } from '../../src/InterceptorInterface';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('interceptor', () => {
    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Interceptor()
      class NumbersInterceptor implements InterceptorInterface {
        intercept(action: Action, result: any): any {
          return result.replace(/[0-9]/gi, '');
        }
      }

      class ByeWordInterceptor implements InterceptorInterface {
        intercept(action: Action, result: any): any {
          return result.replace(/bye/gi, 'hello');
        }
      }

      class BadWordsInterceptor implements InterceptorInterface {
        intercept(action: Action, result: any): any {
          return result.replace(/damn/gi, '***');
        }
      }

      class AsyncInterceptor implements InterceptorInterface {
        intercept(action: Action, result: any): any {
          return new Promise(ok => {
            setTimeout(() => {
              ok(result.replace(/hello/gi, 'bye'));
            }, 1000);
          });
        }
      }

      @Controller()
      @UseInterceptor(ByeWordInterceptor)
      class HandledController {
        @Get('/users')
        @UseInterceptor((action: Action, result: any) => {
          return result.replace(/hello/gi, 'hello world');
        })
        getUsers(): any {
          return '<html><body>damn hello</body></html>';
        }

        @Get('/posts')
        @UseInterceptor(BadWordsInterceptor)
        posts(): any {
          return '<html><body>this post contains damn bad words</body></html>';
        }

        @Get('/questions')
        questions(): any {
          return '<html><body>bye world</body></html>';
        }

        @Get('/files')
        files(): any {
          return '<html><body>hello1234567890 world</body></html>';
        }

        @Get('/photos')
        @UseInterceptor(AsyncInterceptor)
        photos(): any {
          return '<html><body>hello world</body></html>';
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('custom interceptor function should replace returned content', async () => {
      expect.assertions(3);
      const response = await axios.get('/users');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>damn hello world</body></html>');
    });

    it('custom interceptor class should replace returned content', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>this post contains *** bad words</body></html>');
    });

    it('custom interceptor class used on the whole controller should replace returned content', async () => {
      expect.assertions(3);
      const response = await axios.get('/questions');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>hello world</body></html>');
    });

    it('global interceptor class should replace returned content', async () => {
      expect.assertions(3);
      const response = await axios.get('/files');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>hello world</body></html>');
    });

    it('interceptors should support promises', async () => {
      expect.assertions(3);
      const response = await axios.get('/photos');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>bye world</body></html>');
    });
  });
});

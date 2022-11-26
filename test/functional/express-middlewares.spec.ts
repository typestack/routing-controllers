import express from 'express';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Middleware } from '../../src/decorator/Middleware';
import { UseAfter } from '../../src/decorator/UseAfter';
import { UseBefore } from '../../src/decorator/UseBefore';
import { ExpressMiddlewareInterface } from '../../src/driver/express/ExpressMiddlewareInterface';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import { NotAcceptableError } from './../../src/http-error/NotAcceptableError';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('express middlewares', () => {
    let useBefore: boolean,
      useAfter: boolean,
      useCustom: boolean,
      useCustomWithError: boolean,
      useGlobalBeforeWithError: boolean,
      useGlobalBefore: boolean,
      useGlobalAfter: boolean,
      useCallOrder: string,
      useGlobalCallOrder: string;

    beforeEach(() => {
      useBefore = false;
      useAfter = undefined;
      useCustom = undefined;
      useCustomWithError = undefined;
      useGlobalBeforeWithError = undefined;
      useGlobalBefore = undefined;
      useGlobalAfter = undefined;
      useCallOrder = undefined;
    });

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'before' })
      class TestGlobalBeforeMidleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          useGlobalBefore = true;
          useGlobalCallOrder = 'setFromGlobalBefore';
          next();
        }
      }

      @Middleware({ type: 'after' })
      class TestGlobalAfterMidleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          useGlobalAfter = true;
          useGlobalCallOrder = 'setFromGlobalAfter';
          next();
        }
      }

      class TestLoggerMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          useCustom = true;
          next();
        }
      }

      class TestCustomMiddlewareWhichThrows implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          throw new NotAcceptableError('TestCustomMiddlewareWhichThrows');
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/blogs')
        blogs(): string {
          useGlobalCallOrder = 'setFromController';
          return '1234';
        }

        @Get('/questions')
        @UseBefore(TestLoggerMiddleware)
        questions(): string {
          return '1234';
        }

        @Get('/users')
        @UseBefore(function (request: any, response: any, next: Function) {
          useBefore = true;
          useCallOrder = 'setFromUseBefore';
          next();
        })
        users(): string {
          useCallOrder = 'setFromController';
          return '1234';
        }

        @Get('/photos')
        @UseAfter(function (request: any, response: any, next: Function) {
          useAfter = true;
          useCallOrder = 'setFromUseAfter';
          next();
        })
        photos(): string {
          useCallOrder = 'setFromController';
          return '1234';
        }

        @Get('/posts')
        @UseBefore(function (request: any, response: any, next: Function) {
          useBefore = true;
          useCallOrder = 'setFromUseBefore';
          next();
        })
        @UseAfter(function (request: any, response: any, next: Function) {
          useAfter = true;
          useCallOrder = 'setFromUseAfter';
          next();
        })
        posts(): string {
          useCallOrder = 'setFromController';
          return '1234';
        }

        @Get('/customMiddlewareWichThrows')
        @UseBefore(TestCustomMiddlewareWhichThrows)
        customMiddlewareWichThrows(): string {
          return '1234';
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('should call a global middlewares', async () => {
      expect.assertions(4);
      const response = await axios.get('/blogs');
      expect(useGlobalBefore).toEqual(true);
      expect(useGlobalAfter).toEqual(true);
      expect(useGlobalCallOrder).toEqual('setFromGlobalAfter');
      expect(response.status).toEqual(HttpStatusCodes.OK);
    });

    it('should use a custom middleware when @UseBefore or @UseAfter is used', async () => {
      expect.assertions(2);
      const response = await axios.get('/questions');
      expect(useCustom).toEqual(true);
      expect(response.status).toEqual(HttpStatusCodes.OK);
    });

    it('should call middleware and call it before controller action when @UseBefore is used', async () => {
      expect.assertions(3);
      const response = await axios.get('/users');
      expect(useBefore).toEqual(true);
      expect(useCallOrder).toEqual('setFromController');
      expect(response.status).toEqual(HttpStatusCodes.OK);
    });

    it('should call middleware and call it after controller action when @UseAfter is used', async () => {
      expect.assertions(3);
      const response = await axios.get('/photos');
      expect(useAfter).toEqual(true);
      expect(useCallOrder).toEqual('setFromUseAfter');
      expect(response.status).toEqual(HttpStatusCodes.OK);
    });

    it('should call before middleware and call after middleware when @UseAfter and @UseAfter are used', async () => {
      expect.assertions(4);
      const response = await axios.get('/posts');
      expect(useBefore).toEqual(true);
      expect(useAfter).toEqual(true);
      expect(useCallOrder).toEqual('setFromUseAfter');
      expect(response.status).toEqual(HttpStatusCodes.OK);
    });

    it('should handle errors in custom middlewares', async () => {
      expect.assertions(1);
      try {
        await axios.get('/customMiddlewareWichThrows');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
      }
    });
  });
});

import express from 'express';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { Middleware } from '../../src/decorator/Middleware';
import { UseAfter } from '../../src/decorator/UseAfter';
import { ExpressErrorMiddlewareInterface } from '../../src/driver/express/ExpressErrorMiddlewareInterface';
import { HttpError } from '../../src/http-error/HttpError';
import { NotFoundError } from '../../src/http-error/NotFoundError';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('express error handling', () => {
    let errorHandlerCalled: boolean;
    let errorHandledSpecifically: boolean;

    beforeEach(() => {
      errorHandlerCalled = undefined;
      errorHandledSpecifically = undefined;
    });

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'after' })
      class AllErrorsHandler implements ExpressErrorMiddlewareInterface {
        error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
          errorHandlerCalled = true;
          // ERROR HANDLED GLOBALLY
          next(error);
        }
      }

      class SpecificErrorHandler implements ExpressErrorMiddlewareInterface {
        error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
          errorHandledSpecifically = true;
          // ERROR HANDLED SPECIFICALLY
          next(error);
        }
      }

      class SoftErrorHandler implements ExpressErrorMiddlewareInterface {
        error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
          // ERROR WAS IGNORED
          next();
        }
      }

      class ToJsonError extends HttpError {
        public publicData: string;
        public secretData: string;

        constructor(httpCode: number, publicMsg?: string, privateMsg?: string) {
          super(httpCode);
          Object.setPrototypeOf(this, ToJsonError.prototype);
          this.publicData = publicMsg || 'public';
          this.secretData = privateMsg || 'secret';
        }

        toJSON(): any {
          return {
            status: this.httpCode,
            publicData: `${this.publicData} (${this.httpCode})`,
          };
        }
      }

      @JsonController()
      class ExpressErrorHandlerController {
        @Get('/blogs')
        blogs(): any {
          return {
            id: 1,
            title: 'About me',
          };
        }

        @Get('/posts')
        posts(): never {
          throw new Error('System error, cannot retrieve posts');
        }

        @Get('/videos')
        videos(): never {
          throw new NotFoundError('Videos were not found.');
        }

        @Get('/questions')
        @UseAfter(SpecificErrorHandler)
        questions(): never {
          throw new Error('Something is wrong... Cannot load questions');
        }

        @Get('/files')
        @UseAfter(SoftErrorHandler)
        files(): never {
          throw new Error('Something is wrong... Cannot load files');
        }

        @Get('/photos')
        photos(): string {
          return '1234';
        }

        @Get('/stories')
        stories(): never {
          throw new ToJsonError(503, 'sorry, try it again later', 'impatient user');
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done);
    });

    it('should not call global error handler middleware if there was no errors', async () => {
      expect.assertions(2);
      const response = await axios.get('/blogs');
      expect(errorHandlerCalled).toBeFalsy();
      expect(response.status).toEqual(HttpStatusCodes.OK);
    });

    it('should call global error handler middleware', async () => {
      expect.assertions(3);
      try {
        await axios.get('/posts');
      } catch (error) {
        expect(errorHandlerCalled).toBeTruthy();
        expect(errorHandledSpecifically).toBeFalsy();
        expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      }
    });

    it('should call global error handler middleware', async () => {
      expect.assertions(3);
      try {
        await axios.get('/videos');
      } catch (error) {
        expect(errorHandlerCalled).toBeTruthy();
        expect(errorHandledSpecifically).toBeFalsy();
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('should call error handler middleware if used', async () => {
      expect.assertions(3);
      try {
        await axios.get('/questions');
      } catch (error) {
        expect(errorHandlerCalled).toBeTruthy();
        expect(errorHandledSpecifically).toBeTruthy();
        expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      }
    });

    it('should not execute next middleware if soft error handled specifically and stopped error bubbling', async () => {
      expect.assertions(3);
      try {
        await axios.get('/files');
      } catch (error) {
        expect(errorHandlerCalled).toBeFalsy();
        expect(errorHandledSpecifically).toBeFalsy();
        expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      }
    });

    it('should process JsonErrors by their toJSON method if it exists', async () => {
      expect.assertions(4);
      try {
        await axios.get('/stories');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.SERVICE_UNAVAILABLE);
        expect(error.response.data.status).toEqual(HttpStatusCodes.SERVICE_UNAVAILABLE);
        expect(error.response.data.publicData).toEqual('sorry, try it again later (503)');
        expect(error.response.data.secretData).toBeUndefined();
      }
    });
  });
});

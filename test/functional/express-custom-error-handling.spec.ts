import express from 'express';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { Middleware } from '../../src/decorator/Middleware';
import { ExpressErrorMiddlewareInterface } from '../../src/driver/express/ExpressErrorMiddlewareInterface';
import { NotFoundError } from '../../src/http-error/NotFoundError';
import { createExpressServer, getMetadataArgsStorage, HttpError } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('custom express error handling', () => {
    let errorHandlerCalled: boolean;

    beforeEach(() => {
      errorHandlerCalled = false;
    });

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'after' })
      class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
        error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
          errorHandlerCalled = true;
          response.status(error.httpCode).send(error.message);
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

        @Get('/videos')
        videos(): never {
          throw new NotFoundError('Videos were not found.');
        }
      }

      expressServer = createExpressServer({
        defaultErrorHandler: false,
      }).listen(3001, done);
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
        await axios.get('/videos');
      } catch (error) {
        expect(errorHandlerCalled).toBeTruthy();
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
        expect(error.response.data).toEqual('Videos were not found.');
      }
    });
  });
});

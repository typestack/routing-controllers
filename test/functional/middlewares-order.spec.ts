import express from 'express';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Middleware } from '../../src/decorator/Middleware';
import { ExpressMiddlewareInterface } from '../../src/driver/express/ExpressMiddlewareInterface';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('loaded direct from array', () => {
    let middlewaresOrder: number[];

    beforeEach(() => {
      middlewaresOrder = [];
    });

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'after' })
      class ThirdAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(3);
          next();
        }
      }

      @Middleware({ type: 'after' })
      class FirstAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(1);
          next();
        }
      }

      @Middleware({ type: 'after' })
      class SecondAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(2);
          next();
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/test')
        test(): string {
          return 'OK';
        }
      }

      expressServer = createExpressServer({
        middlewares: [FirstAfterMiddleware, SecondAfterMiddleware, ThirdAfterMiddleware],
      }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('should call middlewares in order defined by items order', async () => {
      expect.assertions(4);
      const response = await axios.get('/test');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(middlewaresOrder[0]).toEqual(1);
      expect(middlewaresOrder[1]).toEqual(2);
      expect(middlewaresOrder[2]).toEqual(3);
    });
  });

  describe('specified by priority option', () => {
    let middlewaresOrder: number[];

    beforeEach(() => {
      middlewaresOrder = [];
    });

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'after', priority: 0 })
      class ThirdAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(3);
          next();
        }
      }

      @Middleware({ type: 'after', priority: 8 })
      class FirstAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(1);
          next();
        }
      }

      @Middleware({ type: 'after', priority: 4 })
      class SecondAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(2);
          next();
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/test')
        test(): string {
          return 'OK';
        }
      }

      expressServer = createExpressServer({
        middlewares: [SecondAfterMiddleware, ThirdAfterMiddleware, FirstAfterMiddleware],
      }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('should call middlewares in order defined by priority parameter of decorator', async () => {
      expect.assertions(4);
      const response = await axios.get('/test');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(middlewaresOrder[0]).toEqual(1);
      expect(middlewaresOrder[1]).toEqual(2);
      expect(middlewaresOrder[2]).toEqual(3);
    });
  });
});

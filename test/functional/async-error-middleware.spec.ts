import { Server } from 'http';
import { AddressInfo } from 'net';
import { Controller, Get, Middleware, createExpressServer, getMetadataArgsStorage } from '../../src';
import { axios } from '../utilities/axios';

describe('async Express error middleware', () => {
  let server: Server;
  afterEach(done => {
    server.close(done);
  });

  it.each(['async', 'sync'])('passes a %s error middleware failure to the next error handler', async mode => {
    getMetadataArgsStorage().reset();
    @Controller()
    class Items {
      @Get('/failure')
      fail(): never {
        throw new Error('original');
      }
    }
    @Middleware({ type: 'after', priority: 10 })
    class AsyncErrorHandler {
      error(error: Error, request: any, response: any, next: Function): void | Promise<void> {
        const failure = new Error(`wrapped: ${error.message}`);
        if (mode === 'sync') throw failure;
        return Promise.resolve().then(() => {
          throw failure;
        });
      }
    }
    @Middleware({ type: 'after', priority: 0 })
    class FinalErrorHandler {
      error(error: Error, request: any, response: any, next: Function): void {
        response.status(503).send(error.message);
      }
    }
    const app = createExpressServer({
      controllers: [Items],
      middlewares: [AsyncErrorHandler, FinalErrorHandler],
      defaultErrorHandler: false,
    });
    server = await new Promise<Server>(resolve => {
      const listener = app.listen(0, () => resolve(listener));
    });
    const result = await axios.get(`http://localhost:${(server.address() as AddressInfo).port}/failure`, {
      validateStatus: () => true,
      timeout: 1000,
    });
    expect(result.status).toBe(503);
    expect(result.data).toBe('wrapped: original');
  });
});

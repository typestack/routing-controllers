import { Server } from 'http';
import { AddressInfo } from 'net';
import { Controller, Get, Middleware, createExpressServer, getMetadataArgsStorage } from '../../src';
import { axios } from '../utilities/axios';

describe('global middleware route prefixes', () => {
  let server: Server;
  afterEach(done => {
    server.close(done);
  });

  it.each(['app', '/app', ''])('matches the controller prefix %s', async routePrefix => {
    getMetadataArgsStorage().reset();
    @Middleware({ type: 'before' })
    class Before {
      use(request: any, response: any, next: Function): void {
        response.setHeader('x-global-middleware', 'called');
        next();
      }
    }
    @Controller('/items')
    class Items {
      @Get()
      list(): string {
        return 'items';
      }
    }
    const app = createExpressServer({ controllers: [Items], middlewares: [Before], routePrefix });
    server = await new Promise<Server>(resolve => {
      const listener = app.listen(0, () => resolve(listener));
    });
    const base = `http://localhost:${(server.address() as AddressInfo).port}`;
    const path = routePrefix ? '/app/items' : '/items';
    const result = await axios.get(base + path);
    expect(result.data).toBe('items');
    expect(result.headers['x-global-middleware']).toBe('called');
    if (routePrefix) {
      const outside = await axios.get(base + '/outside', { validateStatus: () => true });
      expect(outside.status).toBe(404);
      expect(outside.headers['x-global-middleware']).toBeUndefined();
    }
  });
});

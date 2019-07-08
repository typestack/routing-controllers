import 'reflect-metadata';
import {strictEqual} from 'assert';
import {createExpressServer, getMetadataArgsStorage} from '../../src/index';
import {ExpressMiddlewareInterface} from '../../src/driver/express/ExpressMiddlewareInterface';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {Middleware} from '../../src/decorator/Middleware';

const chakram = require('chakram');

describe('order of middlewares', () => {
  describe('loaded direct from array', () => {
    let middlewaresOrder: Array<number>;

    beforeEach(() => {
      middlewaresOrder = [];
    });

    let app: any;
    before(done => {
      // reset metadata args storage
      getMetadataArgsStorage().reset();

      @Middleware({type: 'after'})
      class ThirdAfterMiddleware implements ExpressMiddlewareInterface {
        public use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(3);
          next();
        }
      }

      @Middleware({type: 'after'})
      class FirstAfterMiddleware implements ExpressMiddlewareInterface {
        public use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(1);
          next();
        }
      }

      @Middleware({type: 'after'})
      class SecondAfterMiddleware implements ExpressMiddlewareInterface {
        public use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(2);
          next();
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/test')
        public test() {
          return 'OK';
        }
      }

      app = createExpressServer({
        middlewares: [FirstAfterMiddleware, SecondAfterMiddleware, ThirdAfterMiddleware],
      }).listen(3001, done);
    });

    after(done => app.close(done));

    it('should call middlewares in order defined by items order', () =>
      chakram.get('http://127.0.0.1:3001/test').then((response: any) => {
        strictEqual(response.response.statusCode, 200);
        strictEqual(middlewaresOrder[0], 1);
        strictEqual(middlewaresOrder[1], 2);
        strictEqual(middlewaresOrder[2], 3);
      }));
  });

  describe('specified by priority option', () => {
    let middlewaresOrder: Array<number>;

    beforeEach(() => {
      middlewaresOrder = [];
    });

    let app: any;
    before(done => {
      // reset metadata args storage
      getMetadataArgsStorage().reset();

      @Middleware({type: 'after', priority: 0})
      class ThirdAfterMiddleware implements ExpressMiddlewareInterface {
        public use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(3);
          next();
        }
      }

      @Middleware({type: 'after', priority: 8})
      class FirstAfterMiddleware implements ExpressMiddlewareInterface {
        public use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(1);
          next();
        }
      }

      @Middleware({type: 'after', priority: 4})
      class SecondAfterMiddleware implements ExpressMiddlewareInterface {
        public use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(2);
          next();
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/test')
        public test() {
          return 'OK';
        }
      }

      app = createExpressServer({
        middlewares: [SecondAfterMiddleware, ThirdAfterMiddleware, FirstAfterMiddleware],
      }).listen(3001, done);
    });

    after(done => app.close(done));

    it('should call middlewares in order defined by priority parameter of decorator', () =>
      chakram.get('http://127.0.0.1:3001/test').then((response: any) => {
        strictEqual(response.response.statusCode, 200);
        strictEqual(middlewaresOrder[0], 1);
        strictEqual(middlewaresOrder[1], 2);
        strictEqual(middlewaresOrder[2], 3);
      }));
  });
});

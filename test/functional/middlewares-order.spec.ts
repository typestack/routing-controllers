import 'reflect-metadata';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { ExpressMiddlewareInterface } from '../../src/driver/express/ExpressMiddlewareInterface';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { UseBefore } from '../../src/decorator/UseBefore';
import { Middleware } from '../../src/decorator/Middleware';
import { UseAfter } from '../../src/decorator/UseAfter';
import { NotAcceptableError } from './../../src/http-error/NotAcceptableError';
import { ExpressErrorMiddlewareInterface } from './../../src/driver/express/ExpressErrorMiddlewareInterface';
const chakram = require('chakram');
const expect = chakram.expect;

describe('order of middlewares', () => {
  describe('loaded direct from array', () => {
    let middlewaresOrder: number[];

    beforeEach(() => {
      middlewaresOrder = [];
    });

    let app: any;
    before(done => {
      // reset metadata args storage
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'after' })
      class ThirdAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(3);
          next();
        }
      }

      @Middleware({ type: 'after' })
      class FirstAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(1);
          next();
        }
      }

      @Middleware({ type: 'after' })
      class SecondAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(2);
          next();
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/test')
        test() {
          return 'OK';
        }
      }

      app = createExpressServer({
        middlewares: [FirstAfterMiddleware, SecondAfterMiddleware, ThirdAfterMiddleware],
      }).listen(3001, done);
    });

    after(done => app.close(done));

    it('should call middlewares in order defined by items order', () => {
      return chakram.get('http://127.0.0.1:3001/test').then((response: any) => {
        expect(response).to.have.status(200);
        expect(middlewaresOrder[0]).to.equal(1);
        expect(middlewaresOrder[1]).to.equal(2);
        expect(middlewaresOrder[2]).to.equal(3);
      });
    });
  });

  describe('specified by priority option', () => {
    let middlewaresOrder: number[];

    beforeEach(() => {
      middlewaresOrder = [];
    });

    let app: any;
    before(done => {
      // reset metadata args storage
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'after', priority: 0 })
      class ThirdAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(3);
          next();
        }
      }

      @Middleware({ type: 'after', priority: 8 })
      class FirstAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(1);
          next();
        }
      }

      @Middleware({ type: 'after', priority: 4 })
      class SecondAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: any, response: any, next: (err?: any) => any) {
          middlewaresOrder.push(2);
          next();
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/test')
        test() {
          return 'OK';
        }
      }

      app = createExpressServer({
        middlewares: [SecondAfterMiddleware, ThirdAfterMiddleware, FirstAfterMiddleware],
      }).listen(3001, done);
    });

    after(done => app.close(done));

    it('should call middlewares in order defined by priority parameter of decorator', () => {
      return chakram.get('http://127.0.0.1:3001/test').then((response: any) => {
        expect(response).to.have.status(200);
        expect(middlewaresOrder[0]).to.equal(1);
        expect(middlewaresOrder[1]).to.equal(2);
        expect(middlewaresOrder[2]).to.equal(3);
      });
    });
  });
});

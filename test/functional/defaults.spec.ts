import 'reflect-metadata';
import {strictEqual} from 'assert';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {QueryParam} from '../../src/decorator/QueryParam';
import {OnUndefined} from '../../src/decorator/OnUndefined';
import {assertRequest} from './test-utils';

describe('defaults', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Controller()
    class ExpressController {
      @Get('/nullfunc')
      public nullfunc(): string {
        return null;
      }

      @Get('/overridefunc')
      @OnUndefined(404)
      public overridefunc() {}

      @Get('/overrideparamfunc')
      public overrideparamfunc(@QueryParam('x', {required: false}) x: number) {
        return {foo: 'bar'};
      }

      @Get('/paramfunc')
      public paramfunc(@QueryParam('x') x: number) {
        return {foo: 'bar'};
      }

      @Get('/promisevoidfunc')
      public promisevoidfunc() {
        return Promise.resolve();
      }

      @Get('/voidfunc')
      public voidfunc() {}
    }
  });

  const defaultUndefinedResultCode = 204;
  const defaultNullResultCode = 404;
  let expressApp: any;
  let kuaApp: any;
  before(
    done =>
      (expressApp = createExpressServer({
        defaults: {
          nullResultCode: defaultNullResultCode,
          undefinedResultCode: defaultUndefinedResultCode,
          paramOptions: {
            required: true,
          },
        },
      }).listen(3001, done)),
  );
  before(
    done =>
      (kuaApp = createKoaServer({
        defaults: {
          nullResultCode: defaultNullResultCode,
          undefinedResultCode: defaultUndefinedResultCode,
          paramOptions: {
            required: true,
          },
        },
      }).listen(3002, done)),
  );
  after(done => expressApp.close(done));
  after(done => kuaApp.close(done));

  it('should return undefinedResultCode from defaults config for void function', () => {
    assertRequest([3001, 3002], 'get', 'voidfunc', response => {
      strictEqual(response.response.statusCode, defaultUndefinedResultCode);
    });
  });

  it('should return undefinedResultCode from defaults config for promise void function', () => {
    assertRequest([3001, 3002], 'get', 'promisevoidfunc', response => {
      strictEqual(response.response.statusCode, defaultUndefinedResultCode);
    });
  });

  it('should return 400 from required paramOptions', () => {
    assertRequest([3001, 3002], 'get', 'paramfunc', response => {
      strictEqual(response.response.statusCode, 400);
    });
  });

  it('should return nullResultCode from defaults config', () => {
    assertRequest([3001, 3002], 'get', 'nullfunc', response => {
      strictEqual(response.response.statusCode, defaultNullResultCode);
    });
  });

  it('should return status code from OnUndefined annotation', () => {
    assertRequest([3001, 3002], 'get', 'overridefunc', response => {
      strictEqual(response.response.statusCode, 404);
    });
  });

  it('should mark arg optional from QueryParam annotation', () => {
    assertRequest([3001, 3002], 'get', 'overrideparamfunc', response => {
      strictEqual(response.response.statusCode, 200);
    });
  });
});

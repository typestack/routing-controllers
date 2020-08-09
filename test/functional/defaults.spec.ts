import 'reflect-metadata';
import { createExpressServer, createKoaServer, getMetadataArgsStorage } from '../../src/index';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { QueryParam } from '../../src/decorator/QueryParam';
import { OnUndefined } from '../../src/decorator/OnUndefined';
import { assertRequest } from './test-utils';

const chakram = require('chakram');
const expect = chakram.expect;

describe('defaults', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Controller()
    class ExpressController {
      @Get('/voidfunc')
      voidfunc() {}

      @Get('/promisevoidfunc')
      promisevoidfunc() {
        return Promise.resolve();
      }

      @Get('/paramfunc')
      paramfunc(@QueryParam('x') x: number) {
        return { foo: 'bar' };
      }

      @Get('/nullfunc')
      nullfunc(): string {
        return null;
      }

      @Get('/overridefunc')
      @OnUndefined(404)
      overridefunc() {}

      @Get('/overrideparamfunc')
      overrideparamfunc(@QueryParam('x', { required: false }) x: number) {
        return { foo: 'bar' };
      }
    }
  });

  let defaultUndefinedResultCode = 204;
  let defaultNullResultCode = 404;
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
      }).listen(3001, done))
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
      }).listen(3002, done))
  );
  after(done => expressApp.close(done));
  after(done => kuaApp.close(done));

  it('should return undefinedResultCode from defaults config for void function', () => {
    assertRequest([3001, 3002], 'get', 'voidfunc', res => {
      expect(res).to.have.status(defaultUndefinedResultCode);
    });
  });

  it('should return undefinedResultCode from defaults config for promise void function', () => {
    assertRequest([3001, 3002], 'get', 'promisevoidfunc', res => {
      expect(res).to.have.status(defaultUndefinedResultCode);
    });
  });

  it('should return 400 from required paramOptions', () => {
    assertRequest([3001, 3002], 'get', 'paramfunc', res => {
      expect(res).to.have.status(400);
    });
  });

  it('should return nullResultCode from defaults config', () => {
    assertRequest([3001, 3002], 'get', 'nullfunc', res => {
      expect(res).to.have.status(defaultNullResultCode);
    });
  });

  it('should return status code from OnUndefined annotation', () => {
    assertRequest([3001, 3002], 'get', 'overridefunc', res => {
      expect(res).to.have.status(404);
    });
  });

  it('should mark arg optional from QueryParam annotation', () => {
    assertRequest([3001, 3002], 'get', 'overrideparamfunc', res => {
      expect(res).to.have.status(200);
    });
  });
});

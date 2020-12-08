import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { OnUndefined } from '../../src/decorator/OnUndefined';
import { QueryParam } from '../../src/decorator/QueryParam';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;


describe(``, () => {
  let expressServer: HttpServer;

  describe('defaults', () => {

    const defaultUndefinedResultCode = 204;
    const defaultNullResultCode = 404;

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller()
      class ExpressController {
        @Get('/voidfunc')
        voidFunc(): void {
          // Empty
        }

        @Get('/promisevoidfunc')
        promiseVoidFunc(): Promise<void> {
          return Promise.resolve();
        }

        @Get('/paramfunc')
        paramFunc(@QueryParam('x') x: number): any {
          return {
            foo: 'bar',
          };
        }

        @Get('/nullfunc')
        nullFunc(): null {
          return null;
        }

        @Get('/overridefunc')
        @OnUndefined(HttpStatusCodes.NOT_ACCEPTABLE)
        overrideFunc(): void {
          // Empty
        }

        @Get('/overrideparamfunc')
        overrideParamFunc(@QueryParam('x', { required: false }) x: number): any {
          return {
            foo: 'bar',
          };
        }
      }

      expressServer = createExpressServer({
        defaults: {
          nullResultCode: defaultNullResultCode,
          undefinedResultCode: defaultUndefinedResultCode,
          paramOptions: {
            required: true,
          },
        },
      }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it('should return undefinedResultCode from defaults config for void function', async () => {
      expect.assertions(1);
      const response = await axios.get('/voidfunc');
      expect(response.status).toEqual(defaultUndefinedResultCode);
    });

    it('should return undefinedResultCode from defaults config for promise void function', async () => {
      expect.assertions(1);
      const response = await axios.get('/promisevoidfunc');
      expect(response.status).toEqual(defaultUndefinedResultCode);
    });

    it('should return 400 from required paramOptions', async () => {
      expect.assertions(1);
      try {
        await axios.get('/paramfunc');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
      }
    });

    it('should return nullResultCode from defaults config', async () => {
      expect.assertions(1);
      try {
        await axios.get('/nullfunc');
      }
      catch (error) {
        expect(error.response.status).toEqual(defaultNullResultCode);
      }
    });

    it('should return status code from OnUndefined annotation', async () => {
      expect.assertions(1);
      try {
        await axios.get('/overridefunc');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
      }
    });

    it('should mark arg optional from QueryParam annotation', async () => {
      expect.assertions(1);
      const response = await axios.get('/overrideparamfunc');
      expect(response.status).toEqual(HttpStatusCodes.OK);
    });
  })
});
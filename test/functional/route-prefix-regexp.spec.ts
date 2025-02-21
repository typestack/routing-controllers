import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { createExpressServer, Get, getMetadataArgsStorage, JsonController } from '../../src';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe('routePrefix functionality', () => {
  let expressServer: HttpServer;

  afterEach((done: DoneCallback) => {
    if (expressServer) {
      expressServer.close(done);
    } else {
      done();
    }
  });

  describe('string routePrefix', () => {
    beforeEach((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class TestController {
        @Get('/test')
        test() {
          return { status: 'success' };
        }

        @Get('/nested/route')
        nested() {
          return { status: 'nested' };
        }
      }

      expressServer = createExpressServer({
        controllers: [TestController],
        routePrefix: '/api',
      }).listen(3001, done);
    });

    it('should work with basic string prefix', async () => {
      const response = await axios.get('/api/test');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ status: 'success' });
    });

    it('should work with nested routes', async () => {
      const response = await axios.get('/api/nested/route');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ status: 'nested' });
    });

    it('should 404 on wrong prefix', async () => {
      try {
        await axios.get('/wrong/test');
        fail('Should not reach here');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });
  });

  describe('RegExp routePrefix', () => {
    beforeEach((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class TestController {
        @Get('/test')
        test() {
          return { status: 'success' };
        }

        @Get('/nested/route')
        nested() {
          return { status: 'nested' };
        }
      }

      expressServer = createExpressServer({
        controllers: [TestController],
        routePrefix: /\/.*\/api/,
      }).listen(3001, done);
    });

    it('should match simple dynamic prefix', async () => {
      const response = await axios.get('/dev/api/test');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ status: 'success' });
    });

    it('should match multiple segments in dynamic prefix', async () => {
      const response = await axios.get('/staging/v1/api/test');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ status: 'success' });
    });

    it('should work with nested routes', async () => {
      const response = await axios.get('/dev/api/nested/route');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ status: 'nested' });
    });

    it('should 404 on non-matching regex pattern', async () => {
      try {
        await axios.get('/dev/wrong/test');
        fail('Should not reach here');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      getMetadataArgsStorage().reset();
    });

    it('should work with empty routePrefix', (done: DoneCallback) => {
      @JsonController()
      class TestController {
        @Get('/test')
        test() {
          return { status: 'success' };
        }
      }

      expressServer = createExpressServer({
        controllers: [TestController],
        routePrefix: '',
      }).listen(3001, async () => {
        const response = await axios.get('/test');
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.data).toEqual({ status: 'success' });
        done();
      });
    });

    it('should work with complex regex patterns', (done: DoneCallback) => {
      @JsonController()
      class TestController {
        @Get('/test')
        test() {
          return { status: 'success' };
        }
      }

      expressServer = createExpressServer({
        controllers: [TestController],
        routePrefix: /\/v[0-9]+\/[a-z]+\/api/,
      }).listen(3001, async () => {
        const response = await axios.get('/v1/stage/api/test');
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.data).toEqual({ status: 'success' });
        done();
      });
    });

    it('should handle regex with optional groups', (done: DoneCallback) => {
      @JsonController()
      class TestController {
        @Get('/test')
        test() {
          return { status: 'success' };
        }
      }

      expressServer = createExpressServer({
        controllers: [TestController],
        routePrefix: /\/api(\/v[0-9]+)?/,
      }).listen(3001, async () => {
        // Should match both with and without version
        const response1 = await axios.get('/api/test');
        expect(response1.status).toEqual(HttpStatusCodes.OK);

        const response2 = await axios.get('/api/v1/test');
        expect(response2.status).toEqual(HttpStatusCodes.OK);
        done();
      });
    });
  });
});

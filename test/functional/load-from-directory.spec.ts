import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { defaultFakeService } from '../fakes/global-options/FakeService';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('loading all controllers from the given directories', () => {
    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();
      expressServer = createExpressServer({
        controllers: [
          __dirname + '/../fakes/global-options/first-controllers/**/*{.js,.ts}',
          __dirname + '/../fakes/global-options/second-controllers/*{.js,.ts}',
        ],
      }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done);
    });

    it('should load all controllers', async () => {
      expect.assertions(10);
      let response = await axios.get('/posts');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual([
        { id: 1, title: '#1' },
        { id: 2, title: '#2' },
      ]);

      response = await axios.get('/questions');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual([
        { id: 1, title: '#1' },
        { id: 2, title: '#2' },
      ]);

      response = await axios.get('/answers');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual([
        { id: 1, title: '#1' },
        { id: 2, title: '#2' },
      ]);

      response = await axios.get('/photos');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual('Hello photos');

      response = await axios.get('/videos');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual('Hello videos');
    });
  });

  describe('loading all express middlewares and error handlers from the given directories', () => {
    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller()
      class ExpressMiddlewareDirectoriesController {
        @Get('/publications')
        publications(): any[] {
          return [];
        }

        @Get('/articles')
        articles(): any[] {
          throw new Error('Cannot load articles');
        }
      }

      expressServer = createExpressServer({
        middlewares: [__dirname + '/../fakes/global-options/express-middlewares/**/*{.js,.ts}'],
      }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done);
    });

    beforeEach(() => defaultFakeService.reset());

    it('should succeed', async () => {
      expect.assertions(6);
      const response = await axios.get('/publications');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(defaultFakeService.postMiddlewareCalled).toBeTruthy();
      expect(defaultFakeService.questionMiddlewareCalled).toBeTruthy();
      expect(defaultFakeService.questionErrorMiddlewareCalled).toBeFalsy();
      expect(defaultFakeService.fileMiddlewareCalled).toBeFalsy();
      expect(defaultFakeService.videoMiddlewareCalled).toBeFalsy();
    });

    it('should fail', async () => {
      expect.assertions(6);
      try {
        await axios.get('/articles');
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(defaultFakeService.postMiddlewareCalled).toBeTruthy();
        expect(defaultFakeService.questionMiddlewareCalled).toBeTruthy();
        expect(defaultFakeService.questionErrorMiddlewareCalled).toBeTruthy();
        expect(defaultFakeService.fileMiddlewareCalled).toBeFalsy();
        expect(defaultFakeService.videoMiddlewareCalled).toBeFalsy();
      }
    });
  });
});

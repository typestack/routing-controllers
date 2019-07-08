import 'reflect-metadata';
import {strictEqual, deepStrictEqual} from 'assert';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';
import {defaultFakeService} from '../fakes/global-options/FakeService';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';

describe('controllers and middlewares bulk loading from directories', () => {
  describe('loading all controllers from the given directories', () => {
    before(() => getMetadataArgsStorage().reset());

    const serverOptions = {
      controllers: [
        `${__dirname}/../fakes/global-options/first-controllers/**/*{.js,.ts}`,
        `${__dirname}/../fakes/global-options/second-controllers/*{.js,.ts}`,
      ],
    };
    let expressApp: any;
    let koaApp: any;
    before(done => (expressApp = createExpressServer(serverOptions).listen(3001, done)));
    after(done => expressApp.close(done));
    before(done => (koaApp = createKoaServer(serverOptions).listen(3002, done)));
    after(done => koaApp.close(done));

    assertRequest([3001, 3002], 'get', 'posts', response => {
      deepStrictEqual(response.body, [{id: 1, title: '#1'}, {id: 2, title: '#2'}]);
    });

    assertRequest([3001, 3002], 'get', 'questions', response => {
      deepStrictEqual(response.body, [{id: 1, title: '#1'}, {id: 2, title: '#2'}]);
    });

    assertRequest([3001, 3002], 'get', 'answers', response => {
      deepStrictEqual(response.body, [{id: 1, title: '#1'}, {id: 2, title: '#2'}]);
    });

    assertRequest([3001, 3002], 'get', 'photos', response => {
      strictEqual(response.body, 'Hello photos');
    });

    assertRequest([3001, 3002], 'get', 'videos', response => {
      strictEqual(response.body, 'Hello videos');
    });
  });

  describe('loading all express middlewares and error handlers from the given directories', () => {
    before(() => getMetadataArgsStorage().reset());

    before(() => {
      @Controller()
      class ExpressMiddlewareDirectoriesController {
        @Get('/articles')
        public articles(): Array<any> {
          throw new Error('Cannot load articles');
        }

        @Get('/publications')
        public publications(): Array<any> {
          return [];
        }
      }
    });

    const serverOptions = {
      middlewares: [__dirname + '/../fakes/global-options/express-middlewares/**/*{.js,.ts}'],
    };
    let expressApp: any;
    before(done => (expressApp = createExpressServer(serverOptions).listen(3001, done)));
    after(done => expressApp.close(done));

    beforeEach(() => defaultFakeService.reset());

    assertRequest([3001], 'get', 'publications', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(defaultFakeService.postMiddlewareCalled, true);
      strictEqual(defaultFakeService.questionMiddlewareCalled, true);
      strictEqual(defaultFakeService.questionErrorMiddlewareCalled, false);
      strictEqual(defaultFakeService.fileMiddlewareCalled, false);
      strictEqual(defaultFakeService.videoMiddlewareCalled, false);
    });

    assertRequest([3001], 'get', 'articles', response => {
      strictEqual(response.response.statusCode, 500);
      strictEqual(defaultFakeService.postMiddlewareCalled, true);
      strictEqual(defaultFakeService.questionMiddlewareCalled, true);
      strictEqual(defaultFakeService.questionErrorMiddlewareCalled, true);
      strictEqual(defaultFakeService.fileMiddlewareCalled, false);
      strictEqual(defaultFakeService.videoMiddlewareCalled, false);
    });
  });

  describe('loading all koa middlewares from the given directories', () => {
    before(() => getMetadataArgsStorage().reset());

    before(() => {
      @Controller()
      class KoaMiddlewareDirectoriesController {
        @Get('/articles')
        public articles(): Array<any> {
          throw new Error('Cannot load articles');
        }

        @Get('/publications')
        public publications(): Array<any> {
          return [];
        }
      }
    });

    const serverOptions = {
      middlewares: [__dirname + '/../fakes/global-options/koa-middlewares/**/*{.js,.ts}'],
    };
    let koaApp: any;
    before(done => (koaApp = createKoaServer(serverOptions).listen(3002, done)));
    after(done => koaApp.close(done));

    beforeEach(() => defaultFakeService.reset());

    assertRequest([3002], 'get', 'publications', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(defaultFakeService.postMiddlewareCalled, false);
      strictEqual(defaultFakeService.questionMiddlewareCalled, false);
      strictEqual(defaultFakeService.questionErrorMiddlewareCalled, false);
      strictEqual(defaultFakeService.fileMiddlewareCalled, true);
      strictEqual(defaultFakeService.videoMiddlewareCalled, true);
    });

    assertRequest([3002], 'get', 'articles', response => {
      // strictEqual(response.response.statusCode, 500)
      strictEqual(defaultFakeService.postMiddlewareCalled, false);
      strictEqual(defaultFakeService.questionMiddlewareCalled, false);
      strictEqual(defaultFakeService.questionErrorMiddlewareCalled, false);
      strictEqual(defaultFakeService.fileMiddlewareCalled, true);
      strictEqual(defaultFakeService.videoMiddlewareCalled, true);
    });
  });
});

/*
fakeContainer.services[(FakeService as any).name] = sinon.stub(new FakeService());
// container: fakeContainer*/

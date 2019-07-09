import 'reflect-metadata';
import {strictEqual} from 'assert';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {Res} from '../../src/decorator/Res';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';
import {Render} from '../../src/decorator/Render';
import * as path from 'path';

describe('template rendering', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Controller()
    class RenderController {
      @Get('/index')
      @Render('render-test-spec.html')
      public index() {
        return {
          name: 'Routing-controllers',
        };
      }

      @Get('/locals')
      @Render('render-test-locals-spec.html')
      public locals(@Res() res: any) {
        res.locals.myVariable = 'my-variable';

        return {
          name: 'Routing-controllers',
        };
      }
    }
  });

  let expressApp: any;
  before(done => {
    const pathStr = path.resolve(__dirname, '../../test/resources');
    const server = createExpressServer();
    const mustacheExpress = require('mustache-express');
    server.engine('html', mustacheExpress());
    server.set('view engine', 'html');
    server.set('views', pathStr);
    server.use(require('express').static(pathStr));
    expressApp = server.listen(3001, done);
  });
  after(done => expressApp.close(done));

  let koaApp: any;
  before(done => {
    const pathStr = path.resolve(__dirname, '../../test/resources');
    const server = createKoaServer();
    const koaViews = require('koa-views');
    server.use(koaViews(pathStr, {map: {html: 'handlebars'}}));
    koaApp = server.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('should render a template and use given variables', () => {
    assertRequest([3001, 3002], {uri: 'index'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.body, '<html>\n<body>\nRouting-controllers\n</body>\n</html>');
    });
  });

  describe('Express should render a template with given variables and locals variables', () => {
    assertRequest([3001], {uri: 'locals'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.body, '<html>\n\n<body>\n  Routing-controllers\n  my-variable\n</body>\n\n</html>');
    });
  });
});

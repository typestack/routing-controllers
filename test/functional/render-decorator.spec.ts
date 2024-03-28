import express, { Application as ExpressApplication } from 'express';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import mustacheExpress from 'mustache-express';
import koaViews from 'koa-views';
import path from 'path';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Render } from '../../src/decorator/Render';
import { Res } from '../../src/decorator/Res';
import { createExpressServer, createKoaServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {

  function cases(){

    it('should render a template and use given variables', async () => {
      expect.assertions(6);
      const response = await axios.get('/index');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toContain('<html>');
      expect(response.data).toContain('<body>');
      expect(response.data).toContain('Routing-controllers');
      expect(response.data).toContain('</body>');
      expect(response.data).toContain('</html>');
    });

    it('should render a template with given variables and locals variables', async () => {
      expect.assertions(7);
      const response = await axios.get('/locals');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toContain('<html>');
      expect(response.data).toContain('<body>');
      expect(response.data).toContain('Routing-controllers');
      expect(response.data).toContain('my-variable');
      expect(response.data).toContain('</body>');
      expect(response.data).toContain('</html>');
    });

    it('should render to different html by random variables', async () => {
      expect.assertions(2);
      const response = await axios.get('/random');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      const response2 = await axios.get('/random');
      expect(response.data).not.toEqual(response2.data)
    });
  }

  describe('template rendering', () => {
    let expressServer: HttpServer;

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller()
      class RenderController {
        @Get('/index')
        @Render('render-test-spec.html')
        index(): any {
          return {
            name: 'Routing-controllers',
          };
        }

        @Get('/locals')
        @Render('render-test-locals-spec.html')
        locals(@Res() res: any): any {
          res.locals.myVariable = 'my-variable';

          return {
            name: 'Routing-controllers',
          };
        }

        @Get('/random')
        @Render('render-test-spec.html')
        random(): any {
          return {
            name: Math.random(),
          };
        }
      }

      const resourcePath: string = path.resolve(__dirname, '../resources');
      const expressApplication: ExpressApplication = createExpressServer();
      expressApplication.engine('html', mustacheExpress());
      expressApplication.set('view engine', 'html');
      expressApplication.set('views', resourcePath);
      expressApplication.use(express.static(resourcePath));
      expressServer = expressApplication.listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done);
    });

    cases()
  });

  describe('template rendering in koa', () => {
    let koaServer: HttpServer;

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller()
      class RenderController {
        @Get('/index')
        @Render('render-test-spec.html')
        index(): any {
          return {
            name: 'Routing-controllers',
          };
        }

        @Get('/locals')
        @Render('render-test-locals-spec.html')
        locals(@Res() res: any): any {

          return {
            name: 'Routing-controllers',
            myVariable: 'my-variable'
          };
        }

        @Get('/random')
        @Render('render-test-spec.html')
        random(): any {
          return {
            name: Math.random(),
          };
        }
      }

      const resourcePath: string = path.resolve(__dirname, '../resources');
      const app = createKoaServer();
      app.use(koaViews(resourcePath, { map: { html: "handlebars" }}));
      koaServer = app.listen(3001, done);
    });

    afterAll((done: DoneCallback) => koaServer.close(done));

    cases()
  });
});

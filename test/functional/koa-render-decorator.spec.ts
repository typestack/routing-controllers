import { Render } from '../../src/decorator/Render';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import Koa from "koa";
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { createKoaServer, getMetadataArgsStorage, Ctx } from '../../src/index';
import { axios } from '../utilities/axios';
import koaEjs from "@koa/ejs";
import path from "path";
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let koaServer: HttpServer;

  describe('koa template rendering', () => {
    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller()
      class RenderController {
        @Get('/index')
        @Render('ejs-render-test-spec')
        index(): any {
          return {
            name: 'Routing-controllers',
          };
        }

        @Get('/locals')
        @Render('ejs-render-test-locals-spec')
        locals(@Ctx() ctx: any): any {
          ctx.locals = {
            myVariable: 'my-variable'
          };

          return {
            name: 'Routing-controllers',
          };
        }
      }

      const resourcePath: string = path.resolve(__dirname, '../resources');

      const koaApp = createKoaServer() as Koa;
      koaEjs(koaApp, {
        root: resourcePath,
        layout: false,
        viewExt: "html", // Auto-appended to template name
        cache: false,
        debug: true,
      });

      koaServer = koaApp.listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      koaServer.close(done);
    });

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
  });
});

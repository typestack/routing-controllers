import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { Param } from '../../src/decorator/Param';
import { Redirect } from '../../src/decorator/Redirect';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('dynamic redirect', function () {
    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController('/users')
      class TestController {
        @Get('/:id')
        getOne(@Param('id') id: string): any {
          return {
            login: id,
          };
        }
      }

      @JsonController()
      class RedirectController {
        @Get('/template')
        @Redirect('/users/:owner')
        template(): any {
          return { owner: 'pleerock', repo: 'routing-controllers' };
        }

        @Get('/original')
        @Redirect('/users/pleerock')
        original(): void {
          // Empty
        }

        @Get('/override')
        @Redirect('https://api.github.com')
        override(): string {
          return '/users/pleerock';
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('using template', async () => {
      expect.assertions(2);
      const response = await axios.get('/template');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data.login).toEqual('pleerock');
    });

    it('using override', async () => {
      expect.assertions(2);
      const response = await axios.get('/override');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data.login).toEqual('pleerock');
    });

    it('using original', async () => {
      expect.assertions(2);
      const response = await axios.get('/original');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data.login).toEqual('pleerock');
    });
  });
});

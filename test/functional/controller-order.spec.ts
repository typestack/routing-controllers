import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('loaded direct from array', () => {
    let controllerOrder: number[];

    beforeEach(() => {
      controllerOrder = [];
    });

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Controller()
      class ThirdController {
        @Get('/*')
        getAll() {
          controllerOrder.push(3);
          return 'OK';
        }
      }

      @Controller()
      class SecondController {
        @Get('/second/*')
        getAll() {
          controllerOrder.push(2);
          return 'OK';
        }
      }

      @Controller()
      class FirstController {
        @Get('/second/first/*')
        getAll() {
          controllerOrder.push(1);
          return 'OK';
        }
      }

      expressServer = createExpressServer({
        controllers: [FirstController, SecondController, ThirdController],
      }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it('should call controllers in order defined by items order', async () => {
      await axios.get('/second/first/any');
      await axios.get('/second/any');
      await axios.get('/any');
      expect(controllerOrder).toEqual([1, 2, 3]);
    });
  });
});

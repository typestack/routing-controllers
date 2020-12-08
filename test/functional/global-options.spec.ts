import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Body } from '../../src/decorator/Body';
import { JsonController } from '../../src/decorator/JsonController';
import { Post } from '../../src/decorator/Post';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;
  let user: any = { firstName: 'Umed', lastName: 'Khudoiberdiev' };
  let initializedUser: User;

  class User {
    firstName: string;
    lastName: string;

    getName(): string {
      return this.firstName + ' ' + this.lastName;
    }
  }

  describe('routing-controllers global options', () => {
    beforeEach(() => {
      getMetadataArgsStorage().reset();
      initializedUser = undefined;
    });

    describe('useClassTransformer default value', () => {
      beforeEach((done: DoneCallback) => {
        @JsonController()
        class TestUserController {
          @Post('/users')
          postUsers(@Body() user: User): string {
            initializedUser = user;
            return '';
          }

          @Post(new RegExp('/(prefix|regex)/users'))
          postUsersWithRegex(@Body() user: User): string {
            initializedUser = user;
            return '';
          }
        }

        expressServer = createExpressServer({
          controllers: [TestUserController],
          validation: false,
        }).listen(3001, done);
      });

      afterEach((done: DoneCallback) => {
        expressServer.close(done);
      });

      it('useClassTransformer by default must be set to true', async () => {
        expect.assertions(2);
        const response = await axios.post('/users', user);
        expect(initializedUser).toBeInstanceOf(User);
        expect(response.status).toEqual(HttpStatusCodes.OK);
      });
    });

    describe('when useClassTransformer is set to true', () => {
      beforeEach((done: DoneCallback) => {
        @JsonController()
        class TestUserController {
          @Post('/users')
          postUsers(@Body() user: User): string {
            initializedUser = user;
            return '';
          }

          @Post(new RegExp('/(prefix|regex)/users'))
          postUsersWithRegex(@Body() user: User): string {
            initializedUser = user;
            return '';
          }
        }

        expressServer = createExpressServer({
          controllers: [TestUserController],
          classTransformer: true,
          validation: false,
        }).listen(3001, done);
      });

      afterEach((done: DoneCallback) => {
        expressServer.close(done);
      });

      it('useClassTransformer is enabled', async () => {
        expect.assertions(2);
        const response = await axios.post('/users', user);
        expect(initializedUser).toBeInstanceOf(User);
        expect(response.status).toEqual(HttpStatusCodes.OK);
      });
    });

    describe('when useClassTransformer is set to false', () => {
      beforeEach((done: DoneCallback) => {
        @JsonController()
        class TestUserController {
          @Post('/users')
          postUsers(@Body() user: User): string {
            initializedUser = user;
            return '';
          }

          @Post(new RegExp('/(prefix|regex)/users'))
          postUsersWithRegex(@Body() user: User): string {
            initializedUser = user;
            return '';
          }
        }

        expressServer = createExpressServer({
          controllers: [TestUserController],
          classTransformer: false,
          validation: false,
        }).listen(3001, done);
      });

      afterEach((done: DoneCallback) => {
        expressServer.close(done);
      });

      it('useClassTransformer is disabled', async () => {
        expect.assertions(2);
        const response = await axios.post('/users', user);
        expect(initializedUser).not.toBeInstanceOf(User);
        expect(response.status).toEqual(HttpStatusCodes.OK);
      });
    });

    describe('when routePrefix is used all controller routes should be appended by it', () => {
      beforeEach((done: DoneCallback) => {
        @JsonController()
        class TestUserController {
          @Post('/users')
          postUsers(@Body() user: User): string {
            initializedUser = user;
            return '';
          }

          @Post(new RegExp('/(prefix|regex)/users'))
          postUsersWithRegex(@Body() user: User): string {
            initializedUser = user;
            return '';
          }
        }

        expressServer = createExpressServer({
          controllers: [TestUserController],
          routePrefix: 'api',
          validation: false,
        }).listen(3001, done);
      });

      afterEach((done: DoneCallback) => {
        expressServer.close(done);
      });

      it('routePrefix is enabled', async () => {
        expect.assertions(4);
        let response = await axios.post('/api/users', user);
        expect(initializedUser).toBeInstanceOf(User);
        expect(response.status).toEqual(HttpStatusCodes.OK);

        response = await axios.post('/api/regex/users', user);
        expect(initializedUser).toBeInstanceOf(User);
        expect(response.status).toEqual(HttpStatusCodes.OK);
      });
    });
  });
});

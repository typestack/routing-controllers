import 'reflect-metadata';
import { JsonController } from '../../src/decorator/JsonController';
import { Post } from '../../src/decorator/Post';
import { Body } from '../../src/decorator/Body';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { Server as HttpServer } from 'http';
import DoneCallback = jest.DoneCallback;
import { AxiosResponse } from 'axios';
import HttpStatusCodes from 'http-status-codes';
import { axios } from '../utilities/axios';

class User {
  firstName: string;
  lastName: string;

  getName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}

let initializedUser: User;
getMetadataArgsStorage().reset();

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

describe('routing-controllers global options', () => {
  let expressServer: HttpServer;
  beforeEach(() => {
    initializedUser = undefined;
  });

  describe('useClassTransformer default value', () => {
    beforeEach((done: DoneCallback) => {
      expressServer = createExpressServer({
        controllers: [TestUserController],
        validation: false,
      }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it('useClassTransformer by default must be set to true', () => {
      expect.assertions(2);
      return axios
        .post('/users', {
          firstName: 'Umed',
          lastName: 'Khudoiberdiev',
        })
        .then((response: AxiosResponse) => {
          expect(initializedUser).toBeInstanceOf(User);
          expect(response.status).toEqual(HttpStatusCodes.OK);
        });
    });
  });

  describe('when useClassTransformer is set to true', () => {
    beforeEach((done: DoneCallback) => {
      expressServer = createExpressServer({
        classTransformer: true,
        validation: false,
      }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it('useClassTransformer is enabled', () => {
      expect.assertions(2);
      return axios
        .post('/users', {
          firstName: 'Umed',
          lastName: 'Khudoiberdiev',
        })
        .then((response: AxiosResponse) => {
          expect(initializedUser).toBeInstanceOf(User);
          expect(response.status).toEqual(HttpStatusCodes.OK);
        });
    });
  });

  describe('when useClassTransformer is set to false', () => {
    beforeEach((done: DoneCallback) => {
      expressServer = createExpressServer({
        classTransformer: false,
        validation: false,
      }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it('useClassTransformer is disabled', () => {
      expect.assertions(2);
      return axios
        .post('/users', {
          firstName: 'Umed',
          lastName: 'Khudoiberdiev',
        })
        .then((response: AxiosResponse) => {
          expect(initializedUser).not.toBeInstanceOf(User);
          expect(response.status).toEqual(HttpStatusCodes.OK);
        });
    });
  });

  describe('when routePrefix is used all controller routes should be appended by it', () => {
    beforeEach((done: DoneCallback) => {
      expressServer = createExpressServer({
        routePrefix: 'api',
        validation: false,
      }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it('routePrefix is enabled', () => {
      expect.assertions(4);
      return Promise.all<AxiosResponse | void>([
        axios
          .post('/api/users', {
            firstName: 'Umed',
            lastName: 'Khudoiberdiev',
          })
          .then((response: AxiosResponse) => {
            expect(initializedUser).toBeInstanceOf(User);
            expect(response.status).toEqual(HttpStatusCodes.OK);
          }),
        axios
          .post('/api/regex/users', {
            firstName: 'Umed',
            lastName: 'Khudoiberdiev',
          })
          .then((response: AxiosResponse) => {
            expect(initializedUser).toBeInstanceOf(User);
            expect(response.status).toEqual(HttpStatusCodes.OK);
          }),
      ]);
    });
  });
});

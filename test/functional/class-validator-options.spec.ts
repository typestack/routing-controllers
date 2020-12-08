import { Expose } from 'class-transformer';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import qs from 'qs';
import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { QueryParam } from '../../src/decorator/QueryParam';
import { createExpressServer, getMetadataArgsStorage, ResponseClassTransformOptions } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  class UserFilter {
    keyword: string;
  }

  class UserModel {
    id: number;
    _firstName: string;
    _lastName: string;

    @Expose()
    get name(): string {
      return this._firstName + ' ' + this._lastName;
    }
  }

  afterAll(() => defaultMetadataStorage.clear());

  describe('no options', () => {
    let requestFilter: UserFilter;

    beforeEach((done: DoneCallback) => {
      requestFilter = undefined;
      getMetadataArgsStorage().reset();

      @JsonController()
      class UserController {
        @Get('/user')
        getUsers(@QueryParam('filter') filter: UserFilter): any {
          requestFilter = filter;
          const user = new UserModel();
          user.id = 1;
          user._firstName = 'Umed';
          user._lastName = 'Khudoiberdiev';
          return user;
        }
      }

      expressServer = createExpressServer({
        validation: false,
      }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('should not use any options if not set', async () => {
      expect.assertions(4);
      const response = await axios.get('/user?' + qs.stringify({
        filter: {
          keyword: 'Um',
          __somethingPrivate: 'blablabla',
        },
      }));
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({
        id: 1,
        _firstName: 'Umed',
        _lastName: 'Khudoiberdiev',
        name: 'Umed Khudoiberdiev',
      });
      expect(requestFilter).toBeInstanceOf(UserFilter);
      expect(requestFilter).toEqual({
        keyword: 'Um',
        __somethingPrivate: 'blablabla',
      });
    });
  }); // ------ end no options

  describe('global options', () => {
    let requestFilter: UserFilter;

    beforeEach((done: DoneCallback) => {
      requestFilter = undefined;
      getMetadataArgsStorage().reset();

      @JsonController()
      class ClassTransformUserController {
        @Get('/user')
        getUsers(@QueryParam('filter') filter: UserFilter): any {
          requestFilter = filter;
          const user = new UserModel();
          user.id = 1;
          user._firstName = 'Umed';
          user._lastName = 'Khudoiberdiev';
          return user;
        }
      }

      expressServer = createExpressServer({
        validation: false,
        classToPlainTransformOptions: {
          excludePrefixes: ['_'],
        },
        plainToClassTransformOptions: {
          excludePrefixes: ['__'],
        },
      }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('should apply global options', async () => {
      expect.assertions(4);
      const response = await axios.get('/user?' + qs.stringify({
        filter: {
          keyword: 'Um',
          __somethingPrivate: 'blablabla',
        },
      }));
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({
        id: 1,
        name: 'Umed Khudoiberdiev',
      });
      expect(requestFilter).toBeInstanceOf(UserFilter);
      expect(requestFilter).toEqual({
        keyword: 'Um',
      });
    });
  }); // ----- end global options

  describe('local options', () => {
    let requestFilter: UserFilter;

    beforeEach((done: DoneCallback) => {
      requestFilter = undefined;
      getMetadataArgsStorage().reset();

      @JsonController()
      class ClassTransformUserController {
        @Get('/user')
        @ResponseClassTransformOptions({ excludePrefixes: ['_'] })
        getUsers(@QueryParam('filter', { transform: { excludePrefixes: ['__'] } }) filter: UserFilter): any {
          requestFilter = filter;
          const user = new UserModel();
          user.id = 1;
          user._firstName = 'Umed';
          user._lastName = 'Khudoiberdiev';
          return user;
        }
      }

      expressServer = createExpressServer({
        validation: false,
      }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
      expressServer.close(done)
    });

    it('should apply local options', async () => {
      expect.assertions(4);
      const response = await axios.get('/user?' + qs.stringify({
        filter: {
          keyword: 'Um',
          __somethingPrivate: 'blablabla',
        },
      }));
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({
        id: 1,
        name: 'Umed Khudoiberdiev',
      });
      expect(requestFilter).toBeInstanceOf(UserFilter);
      expect(requestFilter).toEqual({
        keyword: 'Um',
      });
    });
  }); //----- end local options
})
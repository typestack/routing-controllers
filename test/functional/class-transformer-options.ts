import 'reflect-metadata';
import { JsonController } from '../../src/decorator/JsonController';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { assertRequest } from './test-utils';
import { Expose } from 'class-transformer';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { Get } from '../../src/decorator/Get';
import { QueryParam } from '../../src/decorator/QueryParam';
import { ResponseClassTransformOptions } from '../../src/decorator/ResponseClassTransformOptions';
import { RoutingControllersOptions } from '../../src/RoutingControllersOptions';
import { axios } from '../utilities/axios';
import { AxiosError, AxiosResponse } from 'axios';


describe('class transformer options', () => {
  class UserFilter {
    keyword: string;
  }

  let UserModel: any;
  beforeAll(() => {
    class User {
      id: number;
      _firstName: string;
      _lastName: string;

      @Expose()
      get name(): string {
        return this._firstName + ' ' + this._lastName;
      }
    }
    UserModel = User;
  });

  afterAll(() => {
    defaultMetadataStorage.clear();
  });

  describe('should not use any options if not set', () => {
    let requestFilter: any;
    beforeEach(() => {
      requestFilter = undefined;
    });

    beforeAll(() => {
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
    });

    let expressApp: any;
    beforeAll(done => (expressApp = createExpressServer().listen(3001, done)));
    afterAll(done => expressApp.close(done));

    it('technical wrapper', () => {
      expect.assertions(4);
      return axios.get('/user?filter={"keyword": "Um", "__somethingPrivate": "blablabla"}').then((response: AxiosResponse) => {
        expect(response.status).toBe(200);
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
    });
  });

  describe('should apply global options', () => {
    let requestFilter: any;
    beforeEach(() => {
      requestFilter = undefined;
    });

    beforeAll(() => {
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
    });

    const options: RoutingControllersOptions = {
      classToPlainTransformOptions: {
        excludePrefixes: ['_'],
      },
      plainToClassTransformOptions: {
        excludePrefixes: ['__'],
      },
    };

    let expressApp: any, koaApp: any;
    beforeAll(done => (expressApp = createExpressServer(options).listen(3001, done)));
    afterAll(done => expressApp.close(done));

    it('technical wrapper', () => {
      expect.assertions(4);
      return axios.get('/user?filter={"keyword": "Um", "__somethingPrivate": "blablabla"}').then((response: AxiosResponse) => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
          id: 1,
          name: 'Umed Khudoiberdiev',
        });
        expect(requestFilter).toBeInstanceOf(UserFilter);
        expect(requestFilter).toEqual({
          keyword: 'Um',
        });
      });
    });
  });

  describe('should apply local options', () => {
    let requestFilter: any;
    beforeEach(() => {
      requestFilter = undefined;
    });

    beforeAll(() => {
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
    });

    let expressApp: any;
    beforeAll(done => (expressApp = createExpressServer().listen(3001, done)));
    afterAll(done => expressApp.close(done));

    it('technical wrapper', () => {
      expect.assertions(4);
      return axios.get('/user?filter={"keyword": "Um", "__somethingPrivate": "blablabla"}').then((response: AxiosResponse) => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
          id: 1,
          name: 'Umed Khudoiberdiev',
        });
        expect(requestFilter).toBeInstanceOf(UserFilter);
        expect(requestFilter).toEqual({
          keyword: 'Um',
        });
      });
    });
  });
});

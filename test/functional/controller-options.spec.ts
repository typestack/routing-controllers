import 'reflect-metadata';
import { Exclude, Expose } from 'class-transformer';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { JsonController } from '../../src/decorator/JsonController';
import { Post } from '../../src/decorator/Post';
import { Body } from '../../src/decorator/Body';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import { AxiosError, AxiosResponse } from 'axios';

describe('controller options', () => {
  let initializedUser: any;
  let expressApp: any;
  let User: any;

  afterAll(done => {
    defaultMetadataStorage.clear();
    expressApp.close(done);
  });

  beforeEach(() => {
    initializedUser = undefined;
  });

  beforeAll(done => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @Exclude()
    class UserModel {
      @Expose()
      firstName: string;

      lastName: string;
    }
    User = UserModel;

    function handler(user: UserModel) {
      initializedUser = user;
      const ret = new User();
      ret.firstName = user.firstName;
      ret.lastName = user.lastName;
      return ret;
    }

    @JsonController('/default')
    class DefaultController {
      @Post('/')
      postUsers(@Body() user: UserModel) {
        return handler(user);
      }
    }

    @JsonController('/transform', { transformRequest: true, transformResponse: true })
    class TransformController {
      @Post('/')
      postUsers(@Body() user: UserModel) {
        return handler(user);
      }
    }

    @JsonController('/noTransform', { transformRequest: false, transformResponse: false })
    class NoTransformController {
      @Post('/')
      postUsers(@Body() user: UserModel) {
        return handler(user);
      }
    }

    expressApp = createExpressServer().listen(3001, done);
  });

  describe('controller transform is enabled by default', () => {
    expect.assertions(4);
    return axios.post('/default', { firstName: 'Umed', lastName: 'Khudoiberdiev' }).then((response: AxiosResponse) => {
      expect(initializedUser).toBeInstanceOf(User);
      expect(initializedUser.lastName).toBeUndefined();
      expect(response.status).toBe(200);
      expect(response.data.lastName).toBeUndefined();
    });
  });

  describe('when controller transform is enabled', () => {
    expect.assertions(4);
    return axios
      .post('/transform', { firstName: 'Umed', lastName: 'Khudoiberdiev' })
      .then((response: AxiosResponse) => {
        expect(initializedUser).toBeInstanceOf(User);
        expect(initializedUser.lastName).toBeUndefined();
        expect(response.status).toBe(200);
        expect(response.data.lastName).toBeUndefined();
      });
  });

  describe('when controller transform is disabled', () => {
    expect.assertions(4);
    return axios
      .post('/noTransform', { firstName: 'Umed', lastName: 'Khudoiberdiev' })
      .then((response: AxiosResponse) => {
        expect(initializedUser).toBeInstanceOf(User);
        expect(initializedUser.lastName).not.toBeUndefined();
        expect(response.status).toBe(200);
        expect(response.data.lastName).not.toBeUndefined();
      });
  });
});

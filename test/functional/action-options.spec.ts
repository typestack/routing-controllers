import 'reflect-metadata';
import { Exclude, Expose } from 'class-transformer';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { JsonController } from '../../src/decorator/JsonController';
import { Post } from '../../src/decorator/Post';
import { Body } from '../../src/decorator/Body';
import { createExpressServer, createKoaServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import { AxiosError, AxiosResponse } from 'axios';


describe('action options', () => {
  let initializedUser: any;
  let expressApp: any;
  let User: any;

  afterAll((done) => {
    defaultMetadataStorage.clear();
    expressApp.close(done)
  });

  beforeEach(() => {
    initializedUser = undefined;
  });

  beforeAll((done) => {
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
      ret.lastName = user.lastName || 'default';
      return ret;
    }

    @JsonController('', { transformResponse: false })
    class NoTransformResponseController {
      @Post('/default')
      default(@Body() user: UserModel) {
        return handler(user);
      }

      @Post('/transformRequestOnly', { transformRequest: true, transformResponse: false })
      transformRequestOnly(@Body() user: UserModel) {
        return handler(user);
      }

      @Post('/transformResponseOnly', { transformRequest: false, transformResponse: true })
      transformResponseOnly(@Body() user: UserModel) {
        return handler(user);
      }
    }

    expressApp = createExpressServer().listen(3001, done)
  });

  it('should use controller options when action transform options are not set', () => {
    expect.assertions(4);
    return axios.post('/default', { firstName: 'Umed', lastName: 'Khudoiberdiev' }).then((response: AxiosResponse) => {
      expect(initializedUser).toBeInstanceOf(User);
      expect(initializedUser.lastName).toBeUndefined();
      expect(response.status).toBe(200);
      expect(response.data.lastName).toBe('default');
    });
  });

  it('should override controller options with action transformRequest option', () => {
    expect.assertions(4);
    return axios.post('/transformRequestOnly', { firstName: 'Umed', lastName: 'Khudoiberdiev' }).then((response: AxiosResponse) => {
      expect(initializedUser).toBeInstanceOf(User);
      expect(initializedUser.lastName).toBeUndefined();
      expect(response.status).toBe(200);
      expect(response.data.lastName).toBe('default');
    });
  });

  it('should override controller options with action transformResponse option', () => {
    expect.assertions(4);
    return axios.post('/transformResponseOnly', { firstName: 'Umed', lastName: 'Khudoiberdiev' }).then((response: AxiosResponse) => {
      expect(initializedUser).not.toBeInstanceOf(User);
      expect(initializedUser.lastName).not.toBeUndefined();
      expect(response.status).toBe(200);
      expect(response.data.lastName).toBeUndefined();
    });
  });
});

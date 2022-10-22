import { Exclude, Expose } from 'class-transformer';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { Body } from '../../src/decorator/Body';
import { JsonController } from '../../src/decorator/JsonController';
import { Post } from '../../src/decorator/Post';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';

describe(``, () => {
  let expressServer: any;

  describe('controller options', () => {
    let initializedUser: any;
    let user: any = { firstName: 'Umed', lastName: 'Khudoiberdiev' };

    @Exclude()
    class UserModel {
      @Expose()
      firstName: string;

      lastName: string;
    }

    beforeAll(done => {
      // reset metadata args storage
      getMetadataArgsStorage().reset();

      function handler(user: UserModel) {
        initializedUser = user;
        const ret = new UserModel();
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

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll(done => {
      defaultMetadataStorage.clear();
      expressServer.close(done);
    });

    beforeEach(() => {
      initializedUser = undefined;
    });

    it('controller transform is enabled by default', async () => {
      expect.assertions(4);
      try {
        const response = await axios.post('/default', user);
        expect(initializedUser).toBeInstanceOf(UserModel);
        expect(initializedUser.lastName).toBeUndefined();
        expect(response.status).toBe(200);
        expect(response.data.lastName).toBeUndefined();
      } catch (err) {
        console.log(err);
      }
    });

    it('when controller transform is enabled', async () => {
      expect.assertions(4);
      try {
        const response = await axios.post('/transform', user);
        expect(initializedUser).toBeInstanceOf(UserModel);
        expect(initializedUser.lastName).toBeUndefined();
        expect(response.status).toBe(200);
        expect(response.data.lastName).toBeUndefined();
      } catch (err) {
        console.log(err);
      }
    });

    it('when controller transform is disabled', async () => {
      expect.assertions(4);
      try {
        const response = await axios.post('/noTransform', user);
        expect(initializedUser).toMatchObject(user);
        expect(initializedUser.lastName).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.data.lastName).toBeDefined();
      } catch (err) {
        console.log(err);
      }
    });
  });
});

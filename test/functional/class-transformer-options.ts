import 'reflect-metadata';
import {JsonController} from '../../src/decorator/JsonController';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';
import {Expose} from 'class-transformer';
import {defaultMetadataStorage} from 'class-transformer/storage';
import {Get} from '../../src/decorator/Get';
import {QueryParam} from '../../src/decorator/QueryParam';
import {ResponseClassTransformOptions} from '../../src/decorator/ResponseClassTransformOptions';
import {RoutingControllersOptions} from '../../src/RoutingControllersOptions';
const chakram = require('chakram');
const expect = chakram.expect;

describe('class transformer options', () => {
  class UserFilter {
    public keyword: string;
  }

  class UserModel {
    @Expose()
    get name(): string {
      return this._firstName + ' ' + this._lastName;
    }
    public _firstName: string;
    public _lastName: string;
    public id: number;
  }

  after(() => {
    defaultMetadataStorage.clear();
  });

  describe('should not use any options if not set', () => {
    let requestFilter: any;
    beforeEach(() => {
      requestFilter = undefined;
    });

    before(() => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class UserController {
        @Get('/user')
        public getUsers(@QueryParam('filter') filter: UserFilter): any {
          requestFilter = filter;
          const user = new UserModel();
          user.id = 1;
          user._firstName = 'Umed';
          user._lastName = 'Khudoiberdiev';
          return user;
        }
      }
    });

    let expressApp: any, koaApp: any;
    before(done => (expressApp = createExpressServer().listen(3001, done)));
    after(done => expressApp.close(done));
    before(done => (koaApp = createKoaServer().listen(3002, done)));
    after(done => koaApp.close(done));

    assertRequest([3001, 3002], 'get', 'user?filter={"keyword": "Um", "__somethingPrivate": "blablabla"}', response => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.eql({
        id: 1,
        _firstName: 'Umed',
        _lastName: 'Khudoiberdiev',
        name: 'Umed Khudoiberdiev',
      });
      expect(requestFilter).to.be.instanceOf(UserFilter);
      expect(requestFilter).to.be.eql({
        keyword: 'Um',
        __somethingPrivate: 'blablabla',
      });
    });
  });

  describe('should apply global options', () => {
    let requestFilter: any;
    beforeEach(() => {
      requestFilter = undefined;
    });

    before(() => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class ClassTransformUserController {
        @Get('/user')
        public getUsers(@QueryParam('filter') filter: UserFilter): any {
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
    before(done => (expressApp = createExpressServer(options).listen(3001, done)));
    after(done => expressApp.close(done));
    before(done => (koaApp = createKoaServer(options).listen(3002, done)));
    after(done => koaApp.close(done));

    assertRequest([3001, 3002], 'get', 'user?filter={"keyword": "Um", "__somethingPrivate": "blablabla"}', response => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.eql({
        id: 1,
        name: 'Umed Khudoiberdiev',
      });
      expect(requestFilter).to.be.instanceOf(UserFilter);
      expect(requestFilter).to.be.eql({
        keyword: 'Um',
      });
    });
  });

  describe('should apply local options', () => {
    let requestFilter: any;
    beforeEach(() => {
      requestFilter = undefined;
    });

    before(() => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class ClassTransformUserController {
        @Get('/user')
        @ResponseClassTransformOptions({excludePrefixes: ['_']})
        public getUsers(@QueryParam('filter', {transform: {excludePrefixes: ['__']}}) filter: UserFilter): any {
          requestFilter = filter;
          const user = new UserModel();
          user.id = 1;
          user._firstName = 'Umed';
          user._lastName = 'Khudoiberdiev';
          return user;
        }
      }
    });

    let expressApp: any, koaApp: any;
    before(done => (expressApp = createExpressServer().listen(3001, done)));
    after(done => expressApp.close(done));
    before(done => (koaApp = createKoaServer().listen(3002, done)));
    after(done => koaApp.close(done));

    assertRequest([3001, 3002], 'get', 'user?filter={"keyword": "Um", "__somethingPrivate": "blablabla"}', response => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.eql({
        id: 1,
        name: 'Umed Khudoiberdiev',
      });
      expect(requestFilter).to.be.instanceOf(UserFilter);
      expect(requestFilter).to.be.eql({
        keyword: 'Um',
      });
    });
  });
});

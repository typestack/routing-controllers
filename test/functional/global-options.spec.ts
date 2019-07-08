import 'reflect-metadata';
import {strictEqual, ok} from 'assert';
import {JsonController} from '../../src/decorator/JsonController';
import {Post} from '../../src/decorator/Post';
import {Body} from '../../src/decorator/Body';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';

export class User {
  public firstName: string;
  public lastName: string;

  public getName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}

describe('routing-controllers global options', () => {
  let initializedUser: User;

  beforeEach(() => {
    initializedUser = undefined;
  });

  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class TestUserController {
      @Post('/users')
      public postUsers(@Body() user: User) {
        initializedUser = user;
        return '';
      }

      @Post(new RegExp('/(prefix|regex)/users'))
      public postUsersWithRegex(@Body() user: User) {
        initializedUser = user;
        return '';
      }
    }
  });

  describe('useClassTransformer by default must be set to true', () => {
    let expressApp: any, koaApp: any;
    before(done => (expressApp = createExpressServer().listen(3001, done)));
    after(done => expressApp.close(done));
    before(done => (koaApp = createKoaServer().listen(3002, done)));
    after(done => koaApp.close(done));

    assertRequest([3001, 3002], 'post', 'users', {firstName: 'Umed', lastName: 'Khudoiberdiev'}, response => {
      ok(initializedUser instanceof User);
      strictEqual(response.response.statusCode, 200);
    });
  });

  describe('when useClassTransformer is set to true', () => {
    let expressApp: any, koaApp: any;
    before(done => (expressApp = createExpressServer({classTransformer: true}).listen(3001, done)));
    after(done => expressApp.close(done));
    before(done => (koaApp = createKoaServer({classTransformer: true}).listen(3002, done)));
    after(done => koaApp.close(done));

    assertRequest([3001, 3002], 'post', 'users', {firstName: 'Umed', lastName: 'Khudoiberdiev'}, response => {
      ok(initializedUser instanceof User);
      strictEqual(response.response.statusCode, 200);
    });
  });

  describe('when useClassTransformer is not set', () => {
    let expressApp: any;
    let koaApp: any;
    before(done => (expressApp = createExpressServer({classTransformer: false}).listen(3001, done)));
    after(done => expressApp.close(done));
    before(done => (koaApp = createKoaServer({classTransformer: false}).listen(3002, done)));
    after(done => koaApp.close(done));

    assertRequest([3001, 3002], 'post', 'users', {firstName: 'Umed', lastName: 'Khudoiberdiev'}, response => {
      ok(!(initializedUser instanceof User));
      strictEqual(response.response.statusCode, 200);
    });
  });

  describe('when routePrefix is used all controller routes should be appended by it', () => {
    const apps: Array<any> = [];
    before(done => apps.push(createExpressServer({routePrefix: '/api'}).listen(3001, done)));
    before(done => apps.push(createExpressServer({routePrefix: 'api'}).listen(3002, done)));
    before(done => apps.push(createKoaServer({routePrefix: '/api'}).listen(3003, done)));
    before(done => apps.push(createKoaServer({routePrefix: 'api'}).listen(3004, done)));
    after(done => {
      apps.forEach(app => app.close());
      done();
    });

    assertRequest(
      [3001, 3002, 3003, 3004],
      'post',
      'api/users',
      {firstName: 'Umed', lastName: 'Khudoiberdiev'},
      response => {
        ok(initializedUser instanceof User);
        strictEqual(response.response.statusCode, 200);
      },
    );

    assertRequest(
      [3001, 3002, 3003, 3004],
      'post',
      'api/regex/users',
      {firstName: 'Umed', lastName: 'Khudoiberdiev'},
      response => {
        ok(initializedUser instanceof User);
        strictEqual(response.response.statusCode, 200);
      },
    );
  });
});

import 'reflect-metadata';
import {strictEqual} from 'assert';
import {Get} from '../../src/decorator/Get';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';
import {Redirect} from '../../src/decorator/Redirect';
import {JsonController} from '../../src/decorator/JsonController';
import {Param} from '../../src/decorator/Param';

describe('dynamic redirect', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController('/users')
    class TestController {
      @Get('/:id')
      public async getOne(@Param('id') id: string) {
        return {
          login: id,
        };
      }
    }

    @JsonController()
    class RedirectController {
      @Get('/original')
      @Redirect('/users/pleerock')
      public original() {}

      @Get('/override')
      @Redirect('https://api.github.com')
      public override() {
        return '/users/pleerock';
      }

      @Get('/template')
      @Redirect('/users/:owner')
      public template() {
        return {owner: 'pleerock', repo: 'routing-controllers'};
      }
    }
  });

  let expressApp: any;
  before(done => {
    const server = createExpressServer();
    expressApp = server.listen(3001, done);
  });
  after(done => expressApp.close(done));

  let koaApp: any;
  before(done => {
    const server = createKoaServer();
    koaApp = server.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('using template', () => {
    assertRequest([3001, 3002], {uri: 'template'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.body.login, 'pleerock');
    });
  });

  describe('using override', () => {
    assertRequest([3001, 3002], {uri: 'override'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.body.login, 'pleerock');
    });
  });

  describe('using original', () => {
    assertRequest([3001, 3002], {uri: 'original'}, response => {
      strictEqual(response.statusCode, 200);
      strictEqual(response.body.login, 'pleerock');
    });
  });
});

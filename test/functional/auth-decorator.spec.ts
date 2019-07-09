import 'reflect-metadata';
import {strictEqual, deepStrictEqual} from 'assert';
import {Get} from '../../src/decorator/Get';
import {createExpressServer, createKoaServer, getMetadataArgsStorage, NotAcceptableError} from '../../src/index';
import {assertRequest} from './test-utils';
import {JsonController} from '../../src/decorator/JsonController';
import {Authorized} from '../../src/decorator/Authorized';
import {Action} from '../../src/Action';
import {RoutingControllersOptions} from '../../src/RoutingControllersOptions';

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

describe('Controller responds with value when Authorization succeeds (async)', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class AuthController {
      @Authorized()
      @Get('/auth1')
      public auth1() {
        return {test: 'auth1'};
      }

      @Authorized(['role1'])
      @Get('/auth2')
      public auth2() {
        return {test: 'auth2'};
      }

      @Authorized()
      @Get('/auth3')
      public async auth3() {
        await sleep(10);
        return {test: 'auth3'};
      }
    }
  });

  const serverOptions: RoutingControllersOptions = {
    authorizationChecker: async (action: Action, roles?: Array<string>) => {
      await sleep(10);
      return true;
    },
  };

  let expressApp: any;
  before(done => {
    const server = createExpressServer(serverOptions);
    expressApp = server.listen(3001, done);
  });
  after(done => expressApp.close(done));

  let koaApp: any;
  before(done => {
    const server = createKoaServer(serverOptions);
    koaApp = server.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('without roles', () => {
    assertRequest([3001, 3002], {uri: 'auth1'}, response => {
      strictEqual(response.statusCode, 200);
      deepStrictEqual(response.body, {test: 'auth1'});
    });
  });

  describe('with roles', () => {
    assertRequest([3001, 3002], {uri: 'auth2'}, response => {
      strictEqual(response.statusCode, 200);
      deepStrictEqual(response.body, {test: 'auth2'});
    });
  });

  describe('async', () => {
    assertRequest([3001, 3002], {uri: 'auth3'}, response => {
      strictEqual(response.statusCode, 200);
      deepStrictEqual(response.body, {test: 'auth3'});
    });
  });
});

describe('Controller responds with value when Authorization succeeds (sync)', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class AuthController {
      @Authorized()
      @Get('/auth1')
      public auth1() {
        return {test: 'auth1'};
      }

      @Authorized(['role1'])
      @Get('/auth2')
      public auth2() {
        return {test: 'auth2'};
      }

      @Authorized()
      @Get('/auth3')
      public async auth3() {
        await sleep(10);
        return {test: 'auth3'};
      }
    }
  });

  const serverOptions: RoutingControllersOptions = {
    authorizationChecker: (action: Action, roles?: Array<string>) => true,
  };

  let expressApp: any;
  before(done => {
    const server = createExpressServer(serverOptions);
    expressApp = server.listen(3001, done);
  });
  after(done => expressApp.close(done));

  let koaApp: any;
  before(done => {
    const server = createKoaServer(serverOptions);
    koaApp = server.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('without roles', () => {
    assertRequest([3001, 3002], {uri: 'auth1'}, response => {
      strictEqual(response.statusCode, 200);
      deepStrictEqual(response.body, {test: 'auth1'});
    });
  });

  describe('with roles', () => {
    assertRequest([3001, 3002], {uri: 'auth2'}, response => {
      strictEqual(response.statusCode, 200);
      deepStrictEqual(response.body, {test: 'auth2'});
    });
  });

  describe('async', () => {
    assertRequest([3001, 3002], {uri: 'auth3'}, response => {
      strictEqual(response.statusCode, 200);
      deepStrictEqual(response.body, {test: 'auth3'});
    });
  });
});

describe('Authorized Decorators Http Status Code', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class AuthController {
      @Authorized()
      @Get('/auth1')
      public auth1() {
        return {test: 'auth1'};
      }

      @Authorized(['role1'])
      @Get('/auth2')
      public auth2() {
        return {test: 'auth2'};
      }
    }
  });

  const serverOptions: RoutingControllersOptions = {
    authorizationChecker: async (action: Action, roles?: Array<string>) => false,
  };

  let expressApp: any;
  before(done => {
    const server = createExpressServer(serverOptions);
    expressApp = server.listen(3001, done);
  });
  after(done => expressApp.close(done));

  let koaApp: any;
  before(done => {
    const server = createKoaServer(serverOptions);
    koaApp = server.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('without roles', () => {
    assertRequest([3001, 3002], {uri: 'auth1'}, response => {
      strictEqual(response.statusCode, 401);
    });
  });

  describe('with roles', () => {
    assertRequest([3001, 3002], {uri: 'auth2'}, response => {
      strictEqual(response.statusCode, 403);
    });
  });
});

describe('Authorization checker allows to throw (async)', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class AuthController {
      @Authorized()
      @Get('/auth1')
      public auth1() {
        return {test: 'auth1'};
      }
    }
  });

  const serverOptions: RoutingControllersOptions = {
    authorizationChecker: async (action: Action, roles?: Array<string>) => {
      throw new NotAcceptableError('Custom Error');
    },
  };

  let expressApp: any;
  before(done => {
    const server = createExpressServer(serverOptions);
    expressApp = server.listen(3001, done);
  });
  after(done => expressApp.close(done));

  let koaApp: any;
  before(done => {
    const server = createKoaServer(serverOptions);
    koaApp = server.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('custom errors', () => {
    assertRequest([3001, 3002], {uri: 'auth1'}, response => {
      strictEqual(response.statusCode, 406);
      strictEqual(response.body.name, 'NotAcceptableError');
      strictEqual(response.body.message, 'Custom Error');
    });
  });
});

describe('Authorization checker allows to throw (sync)', () => {
  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class AuthController {
      @Authorized()
      @Get('/auth1')
      public auth1() {
        return {test: 'auth1'};
      }
    }
  });

  const serverOptions: RoutingControllersOptions = {
    authorizationChecker: (action: Action, roles?: Array<string>) => {
      throw new NotAcceptableError('Custom Error');
    },
  };

  let expressApp: any;
  before(done => {
    const server = createExpressServer(serverOptions);
    expressApp = server.listen(3001, done);
  });
  after(done => expressApp.close(done));

  let koaApp: any;
  before(done => {
    const server = createKoaServer(serverOptions);
    koaApp = server.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('custom errors', () => {
    assertRequest([3001, 3002], {uri: 'auth1'}, response => {
      strictEqual(response.statusCode, 406);
      strictEqual(response.body.name, 'NotAcceptableError');
      strictEqual(response.body.message, 'Custom Error');
    });
  });
});

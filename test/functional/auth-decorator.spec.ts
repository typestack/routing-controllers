import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Action } from '../../src/Action';
import { Authorized } from '../../src/decorator/Authorized';
import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { createExpressServer, getMetadataArgsStorage, NotAcceptableError } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

const sleep = (time: number): Promise<void> => new Promise(resolve => setTimeout(resolve, time));

describe(``, () => {
  
  let expressServer: HttpServer;

  describe('Controller responds with value when Authorization succeeds (async)', () => {

    beforeEach((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class AuthController {
        @Authorized()
        @Get('/auth1')
        auth1(): any {
          return { test: 'auth1' };
        }

        @Authorized(['role1'])
        @Get('/auth2')
        auth2(): any {
          return { test: 'auth2' };
        }

        @Authorized()
        @Get('/auth3')
        async auth3(): Promise<any> {
          await sleep(10);
          return { test: 'auth3' };
        }
      }

      expressServer = createExpressServer({
        authorizationChecker: async (action: Action, roles?: string[]) => {
          await sleep(10);
          return true;
        },
      }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it('without roles', async () => {
      expect.assertions(2);
      const response = await axios.get('/auth1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ test: 'auth1' });
    });

    it('with roles', async () => {
      expect.assertions(2);
      const response = await axios.get('/auth2');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ test: 'auth2' });
    });

    it('async', async () => {
      expect.assertions(2);
      const response = await axios.get('/auth3');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ test: 'auth3' });
    });
  });

  describe('Controller responds with value when Authorization succeeds (sync)', () => {

    beforeEach((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class AuthController {
        @Authorized()
        @Get('/auth1')
        auth1(): any {
          return { test: 'auth1' };
        }

        @Authorized(['role1'])
        @Get('/auth2')
        auth2(): any {
          return { test: 'auth2' };
        }

        @Authorized()
        @Get('/auth3')
        async auth3(): Promise<any> {
          await sleep(10);
          return { test: 'auth3' };
        }
      }

      expressServer = createExpressServer({
        authorizationChecker: (action: Action, roles?: string[]) => {
          return true;
        },
      }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it('without roles', async () => {
      expect.assertions(2);
      const response = await axios.get('/auth1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ test: 'auth1' });
    });

    it('with roles', async () => {
      expect.assertions(2);
      const response = await axios.get('/auth2');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.data).toEqual({ test: 'auth2' });
    });

    it('async', async () => {
      expect.assertions(2);
      const response = await axios.get('/auth3');
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ test: 'auth3' });
    });
  });

  describe('Authorized Decorators Http Status Code', () => {

    beforeEach((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class AuthController {
        @Authorized()
        @Get('/auth1')
        auth1(): any {
          return { test: 'auth1' };
        }

        @Authorized(['role1'])
        @Get('/auth2')
        auth2(): any {
          return { test: 'auth2' };
        }
      }

      expressServer = createExpressServer({
        authorizationChecker: (action: Action, roles?: string[]) => {
          return false;
        },
      }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it('without roles', async () => {
      expect.assertions(1);
      try {
        await axios.get('/auth1');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
      };
    });

    it('with roles', async () => {
      expect.assertions(1);
      try {
        await axios.get('/auth2');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.FORBIDDEN);
      };
    });
  });

  describe('Authorization checker allows to throw (async)', () => {

    beforeEach((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class AuthController {
        @Authorized()
        @Get('/auth1')
        auth1(): any {
          return { test: 'auth1' };
        }
      }

      expressServer = createExpressServer({
        authorizationChecker: (action: Action, roles?: string[]) => {
          throw new NotAcceptableError('Custom Error');
        },
      }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it('custom errors', async () => {
      expect.assertions(3);
      try {
        await axios.get('/auth1');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
        expect(error.response.data).toHaveProperty('name', 'NotAcceptableError');
        expect(error.response.data).toHaveProperty('message', 'Custom Error');
      };
    });
  });

  describe('Authorization checker allows to throw (sync)', () => {

    beforeEach((done: DoneCallback) => {
      // reset metadata args storage
      getMetadataArgsStorage().reset();

      @JsonController()
      class AuthController {
        @Authorized()
        @Get('/auth1')
        auth1(): any {
          return { test: 'auth1' };
        }
      }

      expressServer = createExpressServer({
        authorizationChecker: (action: Action, roles?: string[]) => {
          throw new NotAcceptableError('Custom Error');
        },
      }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it('custom errors', async () => {
      expect.assertions(3);
      try {
        await axios.get('/auth1');
      }
      catch (error) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
        expect(error.response.data).toHaveProperty('name', 'NotAcceptableError');
        expect(error.response.data).toHaveProperty('message', 'Custom Error');
      };
    });
  });
})
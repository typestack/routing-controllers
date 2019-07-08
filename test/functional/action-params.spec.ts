import 'reflect-metadata';
import {strictEqual, deepStrictEqual, ok} from 'assert';

import {IsString, IsBoolean, Min, MaxLength, ValidateNested} from 'class-validator';
import {getMetadataArgsStorage, createExpressServer, createKoaServer} from '../../src/index';
import {assertRequest} from './test-utils';
import {User} from '../fakes/global-options/User';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {Ctx} from '../../src/decorator/Ctx';
import {Req} from '../../src/decorator/Req';
import {Res} from '../../src/decorator/Res';
import {Param} from '../../src/decorator/Param';
import {Post} from '../../src/decorator/Post';
import {UseBefore} from '../../src/decorator/UseBefore';
import {Session} from '../../src/decorator/Session';
import {SessionParam} from '../../src/decorator/SessionParam';
import {State} from '../../src/decorator/State';
import {QueryParam} from '../../src/decorator/QueryParam';
import {QueryParams} from '../../src/decorator/QueryParams';
import {HeaderParam} from '../../src/decorator/HeaderParam';
import {CookieParam} from '../../src/decorator/CookieParam';
import {Body} from '../../src/decorator/Body';
import {BodyParam} from '../../src/decorator/BodyParam';
import {UploadedFile} from '../../src/decorator/UploadedFile';
import {UploadedFiles} from '../../src/decorator/UploadedFiles';
import {ContentType} from '../../src/decorator/ContentType';
import {JsonController} from '../../src/decorator/JsonController';

describe('action parameters', () => {
  let paramUserId: number;
  let paramFirstId: number;
  let paramSecondId: number;
  let sessionTestElement: string;
  let queryParamSortBy: string;
  let queryParamCount: string;
  let queryParamLimit: number;
  let queryParamShowAll: boolean;
  let queryParamFilter: any;
  let queryParams1: {[key: string]: any};
  let queryParams2: {[key: string]: any};
  let queryParams3: {[key: string]: any};
  let headerParamToken: string;
  let headerParamCount: number;
  let headerParamLimit: number;
  let headerParamShowAll: boolean;
  let headerParamFilter: any;
  let cookieParamToken: string;
  let cookieParamCount: number;
  let cookieParamLimit: number;
  let cookieParamShowAll: boolean;
  let cookieParamFilter: any;
  let body: string;
  let bodyParamName: string;
  let bodyParamAge: number;
  let bodyParamIsActive: boolean;
  let uploadedFileName: string;
  let uploadedFilesFirstName: string;
  let uploadedFilesSecondName: string;
  let requestReq: any;
  let requestRes: any;

  beforeEach(() => {
    paramUserId = undefined;
    paramFirstId = undefined;
    paramSecondId = undefined;
    sessionTestElement = undefined;
    queryParamSortBy = undefined;
    queryParamCount = undefined;
    queryParamLimit = undefined;
    queryParamShowAll = undefined;
    queryParamFilter = undefined;
    queryParams1 = undefined;
    queryParams2 = undefined;
    queryParams3 = undefined;
    headerParamToken = undefined;
    headerParamCount = undefined;
    headerParamShowAll = undefined;
    headerParamLimit = undefined;
    headerParamFilter = undefined;
    cookieParamToken = undefined;
    cookieParamCount = undefined;
    cookieParamShowAll = undefined;
    cookieParamLimit = undefined;
    cookieParamFilter = undefined;
    body = undefined;
    bodyParamName = undefined;
    bodyParamAge = undefined;
    bodyParamIsActive = undefined;
    uploadedFileName = undefined;
    uploadedFilesFirstName = undefined;
    uploadedFilesSecondName = undefined;
    requestReq = undefined;
    requestRes = undefined;
  });

  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    const {SetStateMiddleware} = require('../fakes/global-options/koa-middlewares/SetStateMiddleware');
    const {SessionMiddleware} = require('../fakes/global-options/SessionMiddleware');

    class NestedQueryClass {
      @IsBoolean()
      public isFive: boolean;
      @Min(5)
      public num: number;

      @IsString()
      public str: string;
    }

    class QueryClass {
      @IsString()
      public count?: string;

      @Min(5)
      public limit?: number;

      @ValidateNested()
      public myObject: NestedQueryClass;

      @IsBoolean()
      public showAll: boolean = true;
      @MaxLength(5)
      public sortBy?: string;
    }

    @Controller()
    class UserActionParamsController {
      @Post('/session/')
      @UseBefore(SessionMiddleware)
      public addToSession(@Session() session: any) {
        session.testElement = '@Session test';
        session.fakeObject = {
          name: 'fake',
          fake: true,
          value: 666,
        };
        return `<html><body>@Session</body></html>`;
      }

      @Get('/session-param-empty-error/')
      @UseBefore(SessionMiddleware)
      public errorOnLoadEmptyParamFromSession(@SessionParam('empty') emptyElement: string) {
        sessionTestElement = emptyElement;
        return `<html><body>${emptyElement === undefined}</body></html>`;
      }

      @Get('/photos')
      public getPhotos(
        @QueryParam('sortBy') sortBy: string,
        @QueryParam('count') count: string,
        @QueryParam('limit') limit: number,
        @QueryParam('showAll') showAll: boolean,
      ) {
        queryParamSortBy = sortBy;
        queryParamCount = count;
        queryParamLimit = limit;
        queryParamShowAll = showAll;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-with-required')
      public getPhotosWithIdRequired(@QueryParam('limit', {required: true}) limit: number) {
        queryParamLimit = limit;
        return `<html><body>${limit}</body></html>`;
      }

      @Get('/photos-with-json')
      public getPhotosWithJsonParam(@QueryParam('filter', {parse: true}) filter: {keyword: string; limit: number}) {
        queryParamFilter = filter;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-params-optional')
      public getPhotosWithOptionalQuery(@QueryParams({validate: {skipMissingProperties: true}}) query: QueryClass) {
        queryParams3 = query;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-params')
      public getPhotosWithQuery(@QueryParams() query: QueryClass) {
        queryParams1 = query;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-params-no-validate')
      public getPhotosWithQueryAndNoValidation(@QueryParams({validate: false}) query: QueryClass) {
        queryParams2 = query;
        return `<html><body>hello</body></html>`;
      }

      @Get('/posts')
      public getPosts(
        @HeaderParam('token') token: string,
        @HeaderParam('count') count: number,
        @HeaderParam('showAll') showAll: boolean,
      ) {
        headerParamToken = token;
        headerParamCount = count;
        headerParamShowAll = showAll;
        return `<html><body>hello</body></html>`;
      }

      @Get('/posts-with-required')
      public getPostsWithIdRequired(@HeaderParam('limit', {required: true}) limit: number) {
        headerParamLimit = limit;
        return `<html><body>${limit}</body></html>`;
      }

      @Get('/posts-with-json')
      public getPostsWithJsonParam(@HeaderParam('filter', {parse: true}) filter: {keyword: string; limit: number}) {
        headerParamFilter = filter;
        return `<html><body>hello</body></html>`;
      }

      @Get('/questions')
      public getQuestions(
        @CookieParam('token') token: string,
        @CookieParam('count') count: number,
        @CookieParam('showAll') showAll: boolean,
      ) {
        cookieParamToken = token;
        cookieParamCount = count;
        cookieParamShowAll = showAll;
        return `<html><body>hello</body></html>`;
      }

      @Get('/questions-with-required')
      public getQuestionsWithIdRequired(@CookieParam('limit', {required: true}) limit: number) {
        cookieParamLimit = limit;
        return `<html><body>hello</body></html>`;
      }

      @Get('/questions-with-json')
      public getQuestionsWithJsonParam(@CookieParam('filter', {parse: true}) filter: {keyword: string; limit: number}) {
        cookieParamFilter = filter;
        return `<html><body>hello</body></html>`;
      }

      @Get('/state')
      @UseBefore(SetStateMiddleware)
      @ContentType('application/json')
      public getState(@State() state: User) {
        return state;
      }

      @Get('/users/:userId')
      public getUser(@Param('userId') userId: number) {
        paramUserId = userId;
        return `<html><body>${userId}</body></html>`;
      }

      @Get('/state/username')
      @UseBefore(SetStateMiddleware)
      public getUsernameFromState(@State('username') username: string) {
        return `<html><body>${username}</body></html>`;
      }

      @Get('/users/:firstId/photos/:secondId')
      public getUserPhoto(@Param('firstId') firstId: number, @Param('secondId') secondId: number) {
        paramFirstId = firstId;
        paramSecondId = secondId;
        return `<html><body>${firstId},${secondId}</body></html>`;
      }

      @Get('/users')
      public getUsers(@Req() request: any, @Res() response: any): any {
        requestReq = request;
        requestRes = response;
        return '<html><body>hello</body></html>';
      }

      @Get('/users-direct')
      public getUsersDirect(@Res() response: any): any {
        if (typeof response.send === 'function') {
          return response
            .status(201)
            .contentType('custom/x-sample')
            .send('hi, I was written directly to the response');
        } else {
          response.status = 201;
          response.type = 'custom/x-sample; charset=utf-8';
          response.body = 'hi, I was written directly to the response';
          return response;
        }
      }

      @Get('/users-direct/ctx')
      public getUsersDirectKoa(@Ctx() ctx: any): any {
        ctx.response.status = 201;
        ctx.response.type = 'custom/x-sample; charset=utf-8';
        ctx.response.body = 'hi, I was written directly to the response using Koa Ctx';
        return ctx;
      }

      @Get('/session-param-empty/')
      @UseBefore(SessionMiddleware)
      public loadEmptyParamFromSession(@SessionParam('empty', {required: false}) emptyElement: string) {
        sessionTestElement = emptyElement;
        return `<html><body>${emptyElement === undefined}</body></html>`;
      }

      @Get('/session/')
      @UseBefore(SessionMiddleware)
      public loadFromSession(@SessionParam('testElement') testElement: string) {
        sessionTestElement = testElement;
        return `<html><body>${testElement}</body></html>`;
      }

      @Get('/not-use-session/')
      public notUseSession(@SessionParam('testElement') testElement: string) {
        sessionTestElement = testElement;
        return `<html><body>${testElement}</body></html>`;
      }

      @Post('/files')
      public postFile(@UploadedFile('myfile') file: any): any {
        uploadedFileName = file.originalname;
        return `<html><body>${uploadedFileName}</body></html>`;
      }

      @Post('/files-with-body')
      public postFileWithBody(@UploadedFile('myfile') file: any, @Body() body: any): any {
        uploadedFileName = file.originalname;
        return `<html><body>${uploadedFileName} - ${JSON.stringify(body)}</body></html>`;
      }

      @Post('/files-with-body-param')
      public postFileWithBodyParam(@UploadedFile('myfile') file: any, @BodyParam('p1') p1: string): any {
        uploadedFileName = file.originalname;
        return `<html><body>${uploadedFileName} - ${p1}</body></html>`;
      }

      @Post('/files-with-limit')
      public postFileWithLimit(@UploadedFile('myfile', {options: {limits: {fileSize: 2}}}) file: any): any {
        return `<html><body>${file.originalname}</body></html>`;
      }

      @Post('/files-with-required')
      public postFileWithRequired(@UploadedFile('myfile', {required: true}) file: any): any {
        return `<html><body>${file.originalname}</body></html>`;
      }

      @Post('/photos')
      public postPhotos(@UploadedFiles('photos') files: any): any {
        uploadedFilesFirstName = files[0].originalname;
        uploadedFilesSecondName = files[1].originalname;
        return `<html><body>${uploadedFilesFirstName} ${uploadedFilesSecondName}</body></html>`;
      }

      @Post('/photos-with-limit')
      public postPhotosWithLimit(@UploadedFiles('photos', {options: {limits: {files: 1}}}) files: any): any {
        return `<html><body>${files[0].originalname}</body></html>`;
      }

      @Post('/photos-with-required')
      public postPhotosWithRequired(@UploadedFiles('photos', {required: true}) files: any): any {
        return `<html><body>${files[0].originalname}</body></html>`;
      }

      @Post('/questions')
      public postQuestion(@Body() question: string) {
        body = question;
        return `<html><body>hello</body></html>`;
      }

      @Post('/questions-with-required')
      public postRequiredQuestion(@Body({required: true}) question: string) {
        body = question;
        return `<html><body>hello</body></html>`;
      }
    }

    @JsonController()
    class SecondUserActionParamsController {
      @Get('/posts-after')
      public getPhotosAfter(@QueryParam('from', {required: true}) from: Date): any {
        return from.toISOString();
      }

      @Post('/posts')
      public postPost(@Body() question: any) {
        body = question;
        return body;
      }

      @Post('/posts-with-required')
      public postRequiredPost(@Body({required: true}) post: string) {
        body = post;
        return body;
      }

      @Post('/users')
      public postUser(
        @BodyParam('name') name: string,
        @BodyParam('age') age: number,
        @BodyParam('isActive') isActive: boolean,
      ): any {
        bodyParamName = name;
        bodyParamAge = age;
        bodyParamIsActive = isActive;
        return null;
      }

      @Post('/users-with-required')
      public postUserWithRequired(
        @BodyParam('name', {required: true}) name: string,
        @BodyParam('age', {required: true}) age: number,
        @BodyParam('isActive', {required: true}) isActive: boolean,
      ): any {
        bodyParamName = name;
        bodyParamAge = age;
        bodyParamIsActive = isActive;
        return null;
      }
    }
  });

  let expressApp: any, koaApp: any;
  before(done => {
    expressApp = createExpressServer().listen(3001, done);
  });
  after(done => expressApp.close(done));
  before(done => {
    koaApp = createKoaServer();
    koaApp.keys = ['koa-session-secret'];
    koaApp = koaApp.listen(3002, done);
  });
  after(done => koaApp.close(done));

  describe('@Req and @Res should be provided as Request and Response objects', () => {
    assertRequest([3001, 3002], 'get', 'users', response => {
      ok(requestReq instanceof Object); // apply better check here
      ok(requestRes instanceof Object); // apply better check here
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('writing directly to the response using @Res should work', () => {
    assertRequest([3001, 3002], 'get', 'users-direct', response => {
      strictEqual(response.response.statusCode, 201);
      strictEqual(response.body, 'hi, I was written directly to the response');
      strictEqual(response.response.headers['content-type'], 'custom/x-sample; charset=utf-8');
    });
  });

  describe('writing directly to the response using @Ctx should work', () => {
    assertRequest([3002], 'get', 'users-direct/ctx', response => {
      strictEqual(response.response.statusCode, 201);
      strictEqual(response.body, 'hi, I was written directly to the response using Koa Ctx');
      strictEqual(response.response.headers['content-type'], 'custom/x-sample; charset=utf-8');
    });
  });

  describe('@Param should give a param from route', () => {
    assertRequest([3001, 3002], 'get', 'users/1', response => {
      strictEqual(paramUserId, 1);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>1</body></html>');
    });
  });

  describe('multiple @Param should give a proper values from route', () => {
    assertRequest([3001, 3002], 'get', 'users/23/photos/32', response => {
      strictEqual(paramFirstId, 23);
      strictEqual(paramSecondId, 32);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>23,32</body></html>');
    });
  });

  describe('@Session middleware not use', () => {
    assertRequest([3001, 3002], 'get', 'not-use-session', response => {
      strictEqual(response.response.statusCode, 500);
    });
  });

  describe('@Session should return a value from session', () => {
    assertRequest([3001, 3002], 'post', 'session', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>@Session</body></html>');
      assertRequest([3001, 3002], 'get', 'session', response => {
        strictEqual(response.response.statusCode, 200);
        strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
        strictEqual(response.body, '<html><body>@Session test</body></html>');
        strictEqual(sessionTestElement, '@Session test');
      });
    });
  });

  describe('@Session(param) should allow to inject empty property', () => {
    assertRequest([3001, 3002], 'get', 'session-param-empty', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>true</body></html>');
      strictEqual(sessionTestElement, void 0);
    });
  });

  // TODO: uncomment this after we get rid of calling `next(err)`

  // describe("@Session(param) should throw required error when param is empty", () => {
  //     assertRequest([3001, 3002], "get", "session-param-empty-error", response => {
  //         strictEqual(response.response.statusCode, 400)
  //         // there should be a test for "ParamRequiredError" but chakram is the worst testing framework ever!!!
  //     });
  // });

  describe('@State should return a value from state', () => {
    assertRequest([3001], 'get', 'state', response => {
      strictEqual(response.response.statusCode, 500);
    });
    assertRequest([3001], 'get', 'state/username', response => {
      strictEqual(response.response.statusCode, 500);
    });
    assertRequest([3002], 'get', 'state', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'application/json');
      strictEqual(response.body.username, 'pleerock');
    });
    assertRequest([3002], 'get', 'state/username', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>pleerock</body></html>');
    });
  });

  // todo: enable koa test when #227 fixed
  describe('@QueryParams should give a proper values from request`s query parameters', () => {
    assertRequest([3001 /*3002*/], 'get', 'photos-params?sortBy=name&count=2&limit=10&showAll', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(queryParams1.sortBy, 'name');
      strictEqual(queryParams1.count, '2');
      strictEqual(queryParams1.limit, 10);
      strictEqual(queryParams1.showAll, true);
    });
  });

  describe('@QueryParams should give a proper values from request`s query parameters with nested json', () => {
    assertRequest(
      [3001 /*3002*/],
      'get',
      'photos-params?sortBy=name&count=2&limit=10&showAll&myObject=%7B%22num%22%3A%205,%20%22str%22%3A%20%22five%22,%20%22isFive%22%3A%20true%7D',
      response => {
        strictEqual(response.response.statusCode, 200);
        strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
        strictEqual(queryParams1.sortBy, 'name');
        strictEqual(queryParams1.count, '2');
        strictEqual(queryParams1.limit, 10);
        strictEqual(queryParams1.showAll, true);
        strictEqual(queryParams1.myObject.num, 5);
        strictEqual(queryParams1.myObject.str, 'five');
        strictEqual(queryParams1.myObject.isFive, true);
      },
    );
  });

  describe('@QueryParams should not validate request query parameters when it`s turned off in validator options', () => {
    assertRequest(
      [3001, 3002],
      'get',
      'photos-params-no-validate?sortBy=verylongtext&count=2&limit=1&showAll=true',
      response => {
        strictEqual(response.response.statusCode, 200);
        strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
        strictEqual(queryParams2.sortBy, 'verylongtext');
        strictEqual(queryParams2.count, '2');
        strictEqual(queryParams2.limit, 1);
        strictEqual(queryParams2.showAll, true);
      },
    );
  });

  // todo: enable koa test when #227 fixed
  describe('@QueryParams should give a proper values from request`s optional query parameters', () => {
    assertRequest([3001 /*3002*/], 'get', 'photos-params-optional?sortBy=name&limit=10', response => {
      strictEqual(queryParams3.sortBy, 'name');
      strictEqual(queryParams3.count, undefined);
      strictEqual(queryParams3.limit, 10);
      strictEqual(queryParams3.showAll, true);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('@QueryParam should give a proper values from request query parameters', () => {
    assertRequest([3001, 3002], 'get', 'photos?sortBy=name&count=2&limit=10&showAll=true', response => {
      strictEqual(queryParamSortBy, 'name');
      strictEqual(queryParamCount, '2');
      strictEqual(queryParamLimit, 10);
      strictEqual(queryParamShowAll, true);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('for @QueryParam when required is params must be provided and they should not be empty', () => {
    assertRequest([3001, 3002], 'get', 'photos-with-required/?limit=0', response => {
      strictEqual(queryParamLimit, 0);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>0</body></html>');
    });
    assertRequest([3001, 3002], 'get', 'photos-with-required/?', response => {
      strictEqual(response.response.statusCode, 400);
    });
    assertRequest([3001, 3002], 'get', 'photos-with-required/?limit', response => {
      strictEqual(response.response.statusCode, 400);
    });
  });

  describe('for @QueryParam when the type is Date then it should be parsed', () => {
    assertRequest([3001, 3002], 'get', 'posts-after/?from=2017-01-01T00:00:00Z', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.body, '2017-01-01T00:00:00.000Z');
    });
  });

  describe('for @QueryParam when the type is Date and it is invalid then the response should be a BadRequest error', () => {
    assertRequest([3001, 3002], 'get', 'posts-after/?from=InvalidDate', response => {
      strictEqual(response.response.statusCode, 400);
      strictEqual(response.body.name, 'ParamNormalizationError');
    });
  });

  describe('for @QueryParam when parseJson flag is used query param must be converted to object', () => {
    assertRequest([3001, 3002], 'get', 'photos-with-json/?filter={"keyword": "name", "limit": 5}', response => {
      deepStrictEqual(queryParamFilter, {keyword: 'name', limit: 5});
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('@HeaderParam should give a proper values from request headers', () => {
    const requestOptions = {
      headers: {
        token: '31ds31das231sad12',
        count: 20,
        showAll: false,
      },
    };
    assertRequest([3001, 3002], 'get', 'posts', requestOptions, response => {
      strictEqual(headerParamToken, '31ds31das231sad12');
      strictEqual(headerParamCount, 20);
      strictEqual(headerParamShowAll, false);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('for @HeaderParam when required is params must be provided and they should not be empty', () => {
    const validRequestOptions = {
      headers: {
        limit: 0,
      },
    };
    const invalidRequestOptions = {
      headers: {
        filter: '',
      },
    };
    assertRequest([3001, 3002], 'get', 'posts-with-required', validRequestOptions, response => {
      strictEqual(headerParamLimit, 0);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
    assertRequest([3001, 3002], 'get', 'posts-with-required', invalidRequestOptions, response => {
      strictEqual(response.response.statusCode, 400);
    });
    assertRequest([3001, 3002], 'get', 'posts-with-required', response => {
      strictEqual(response.response.statusCode, 400);
    });
  });

  describe('for @HeaderParam when parseJson flag is used query param must be converted to object', () => {
    const requestOptions = {
      headers: {
        filter: '{"keyword": "name", "limit": 5}',
      },
    };
    assertRequest([3001, 3002], 'get', 'posts-with-json', requestOptions, response => {
      deepStrictEqual(headerParamFilter, {keyword: 'name', limit: 5});
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('@CookieParam should give a proper values from request headers', () => {
    const request = require('request');
    const jar = request.jar();
    const url2 = 'http://127.0.0.1:3002/questions';
    jar.setCookie(request.cookie('token=31ds31das231sad12'), url2);
    jar.setCookie(request.cookie('count=20'), url2);
    jar.setCookie(request.cookie('showAll=false'), url2);

    const requestOptions = {
      jar,
    };
    assertRequest([3001, 3002], 'get', 'questions', requestOptions, response => {
      strictEqual(cookieParamToken, '31ds31das231sad12');
      strictEqual(cookieParamCount, 20);
      strictEqual(cookieParamShowAll, false);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('for @CookieParam when required is params must be provided and they should not be empty', () => {
    const request = require('request');
    const jar = request.jar();
    const url = 'http://127.0.0.1:3001/questions-with-required';
    jar.setCookie(request.cookie('limit=20'), url);

    const validRequestOptions = {jar};
    const invalidRequestOptions = {jar: request.jar()};

    assertRequest([3001, 3002], 'get', 'questions-with-required', validRequestOptions, response => {
      strictEqual(cookieParamLimit, 20);
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });

    assertRequest([3001, 3002], 'get', 'questions-with-required', invalidRequestOptions, response => {
      strictEqual(response.response.statusCode, 400);
    });
  });

  describe('for @CookieParam when parseJson flag is used query param must be converted to object', () => {
    const request = require('request');
    const jar = request.jar();
    const url = 'http://127.0.0.1:3001/questions-with-json';
    jar.setCookie(request.cookie('filter={"keyword": "name", "limit": 5}'), url);
    const requestOptions = {jar};

    assertRequest([3001, 3002], 'get', 'questions-with-json', requestOptions, response => {
      deepStrictEqual(cookieParamFilter, {keyword: 'name', limit: 5});
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  describe('@Body should provide a request body', () => {
    const requestOptions = {
      headers: {
        'Content-type': 'text/plain',
      },
      json: false,
    };

    // todo: koa @Body with text bug. uncomment after fix https://github.com/koajs/bodyparser/issues/52
    assertRequest([3001 /*, 3002*/], 'post', 'questions', 'hello', requestOptions, response => {
      strictEqual(body, 'hello');
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });
  });

  // todo: koa @Body with text bug. uncomment after fix https://github.com/koajs/bodyparser/issues/52
  describe('@Body should fail if required body was not provided', () => {
    const requestOptions = {
      headers: {
        'Content-type': 'text/plain',
      },
      json: false,
    };

    assertRequest([3001 /*, 3002*/], 'post', 'questions-with-required', '0', requestOptions, response => {
      strictEqual(body, '0');
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
    });

    assertRequest([3001, 3002], 'post', 'questions-with-required', '', requestOptions, response => {
      strictEqual(response.response.statusCode, 400);
    });

    assertRequest([3001, 3002], 'post', 'questions-with-required', undefined, requestOptions, response => {
      strictEqual(response.response.statusCode, 400);
    });
  });

  describe('@Body should provide a json object for json-typed controllers and actions', () => {
    assertRequest([3001, 3002], 'post', 'posts', {hello: 'world'}, response => {
      deepStrictEqual(body, {hello: 'world'});
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'application/json; charset=utf-8');
      deepStrictEqual(response.body, body); // should we allow to return a text body for json controllers?
    });
  });

  describe('@Body should fail if required body was not provided for json-typed controllers and actions', () => {
    assertRequest([3001, 3002], 'post', 'posts-with-required', {hello: ''}, response => {
      strictEqual(response.response.statusCode, 200);
    });
    assertRequest([3001, 3002], 'post', 'posts-with-required', undefined, response => {
      strictEqual(response.response.statusCode, 400);
    });
  });

  describe('@BodyParam should provide a json object for json-typed controllers and actions', () => {
    assertRequest([3001, 3002], 'post', 'users', {name: 'johny', age: 27, isActive: true}, response => {
      strictEqual(bodyParamName, 'johny');
      strictEqual(bodyParamAge, 27);
      strictEqual(bodyParamIsActive, true);
      strictEqual(response.response.statusCode, 204);
    });
  });

  describe('@BodyParam should fail if required body was not provided for json-typed controllers and actions', () => {
    assertRequest([3001, 3002], 'post', 'users-with-required', {name: 'johny', age: 27, isActive: true}, response => {
      strictEqual(response.response.statusCode, 204);
    });
    assertRequest([3001, 3002], 'post', 'users-with-required', undefined, response => {
      strictEqual(response.response.statusCode, 400);
    });
    assertRequest([3001, 3002], 'post', 'users-with-required', {name: '', age: 27, isActive: false}, response => {
      strictEqual(response.response.statusCode, 400);
    });
    assertRequest([3001, 3002], 'post', 'users-with-required', {name: 'Johny', age: 0, isActive: false}, response => {
      strictEqual(response.response.statusCode, 204);
    });
    assertRequest(
      [3001, 3002],
      'post',
      'users-with-required',
      {name: 'Johny', age: undefined, isActive: false},
      response => {
        strictEqual(response.response.statusCode, 400);
      },
    );
    assertRequest(
      [3001, 3002],
      'post',
      'users-with-required',
      {name: 'Johny', age: 27, isActive: undefined},
      response => {
        strictEqual(response.response.statusCode, 400);
      },
    );
    assertRequest([3001, 3002], 'post', 'users-with-required', {name: 'Johny', age: 27, isActive: false}, response => {
      strictEqual(response.response.statusCode, 204);
    });
    assertRequest([3001, 3002], 'post', 'users-with-required', {name: 'Johny', age: 27, isActive: true}, response => {
      strictEqual(response.response.statusCode, 204);
    });
  });

  describe('@UploadedFile should provide uploaded file with the given name', () => {
    const requestOptions = {
      formData: {
        myfile: {
          value: 'hello world',
          options: {
            filename: 'hello-world.txt',
            contentType: 'image/text',
          },
        },
      },
    };

    assertRequest([3001, 3002], 'post', 'files', undefined, requestOptions, response => {
      strictEqual(uploadedFileName, 'hello-world.txt');
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>hello-world.txt</body></html>');
    });
  });

  describe('@UploadedFile with @Body should return both the file and the body', () => {
    const requestOptions = {
      formData: {
        myfile: {
          value: 'hello world',
          options: {
            filename: 'hello-world.txt',
            contentType: 'image/text',
          },
        },
        anotherField: 'hi',
        andOther: 'hello',
      },
    };

    assertRequest([3001, 3002], 'post', 'files-with-body', undefined, requestOptions, response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(
        response.body,
        `<html><body>hello-world.txt - {"anotherField":"hi","andOther":"hello"}</body></html>`,
      );
    });
  });

  describe('@UploadedFile with @BodyParam should return both the file and the body param', () => {
    const requestOptions = {
      formData: {
        myfile: {
          value: 'hello world',
          options: {
            filename: 'hello-world.txt',
            contentType: 'image/text',
          },
        },
        p1: 'hi, i`m a param',
      },
    };

    assertRequest([3001, 3002], 'post', 'files-with-body-param', undefined, requestOptions, response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>hello-world.txt - hi, i`m a param</body></html>');
    });
  });

  describe('@UploadedFile with passed uploading options (limit) should throw an error', () => {
    const validRequestOptions = {
      formData: {
        myfile: {
          value: 'a',
          options: {
            filename: 'hello-world.txt',
            contentType: 'image/text',
          },
        },
      },
    };
    const invalidRequestOptions = {
      formData: {
        myfile: {
          value: 'hello world',
          options: {
            filename: 'hello-world.txt',
            contentType: 'image/text',
          },
        },
      },
    };

    assertRequest([3001, 3002], 'post', 'files-with-limit', undefined, validRequestOptions, response => {
      strictEqual(response.response.statusCode, 200);
    });

    assertRequest([3001, 3002], 'post', 'files-with-limit', undefined, invalidRequestOptions, response => {
      strictEqual(response.response.statusCode, 500);
    });
  });

  describe('for @UploadedFile when required is used files must be provided', () => {
    const requestOptions = {
      formData: {
        myfile: {
          value: 'hello world',
          options: {
            filename: 'hello-world.txt',
            contentType: 'image/text',
          },
        },
      },
    };

    assertRequest([3001, 3002], 'post', 'files-with-required', undefined, requestOptions, response => {
      strictEqual(response.response.statusCode, 200);
    });

    assertRequest([3001, 3002], 'post', 'files-with-required', undefined, {}, response => {
      strictEqual(response.response.statusCode, 400);
    });
  });

  describe('@UploadedFiles should provide uploaded files with the given name', () => {
    const requestOptions = {
      formData: {
        photos: [
          {
            value: '0110001',
            options: {
              filename: 'me.jpg',
              contentType: 'image/jpg',
            },
          },
          {
            value: '10011010',
            options: {
              filename: 'she.jpg',
              contentType: 'image/jpg',
            },
          },
        ],
      },
    };

    assertRequest([3001, 3002], 'post', 'photos', undefined, requestOptions, response => {
      strictEqual(uploadedFilesFirstName, 'me.jpg');
      strictEqual(uploadedFilesSecondName, 'she.jpg');
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'text/html; charset=utf-8');
      strictEqual(response.body, '<html><body>me.jpg she.jpg</body></html>');
    });
  });

  describe('@UploadedFiles with passed uploading options (limit) should throw an error', () => {
    const validRequestOptions = {
      formData: {
        photos: [
          {
            value: '0110001',
            options: {
              filename: 'me.jpg',
              contentType: 'image/jpg',
            },
          },
        ],
      },
    };
    const invalidRequestOptions = {
      formData: {
        photos: [
          {
            value: '0110001',
            options: {
              filename: 'me.jpg',
              contentType: 'image/jpg',
            },
          },
          {
            value: '10011010',
            options: {
              filename: 'she.jpg',
              contentType: 'image/jpg',
            },
          },
        ],
      },
    };

    assertRequest([3001, 3002], 'post', 'photos-with-limit', undefined, validRequestOptions, response => {
      strictEqual(response.response.statusCode, 200);
    });
    assertRequest([3001, 3002], 'post', 'photos-with-limit', undefined, invalidRequestOptions, response => {
      strictEqual(response.response.statusCode, 500);
    });
  });

  describe('for @UploadedFiles when required is used files must be provided', () => {
    const requestOptions = {
      formData: {
        photos: [
          {
            value: '0110001',
            options: {
              filename: 'me.jpg',
              contentType: 'image/jpg',
            },
          },
          {
            value: '10011010',
            options: {
              filename: 'she.jpg',
              contentType: 'image/jpg',
            },
          },
        ],
      },
    };

    assertRequest([3001, 3002], 'post', 'photos-with-required', undefined, requestOptions, response => {
      strictEqual(response.response.statusCode, 200);
    });
    assertRequest([3001, 3002], 'post', 'photos-with-required', undefined, {}, response => {
      strictEqual(response.response.statusCode, 400);
    });
  });
});

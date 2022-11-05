import bodyParser from 'body-parser';
import { IsBoolean, IsString, MaxLength, Min, ValidateNested, IsArray, IsNumber, IsDate } from 'class-validator';
import express from 'express';
import FormData from 'form-data';
import fs from 'fs';
import { Server as HttpServer, ServerResponse } from 'http';
import HttpStatusCodes from 'http-status-codes';
import path from 'path';
import qs from 'qs';
import { Body } from '../../src/decorator/Body';
import { BodyParam } from '../../src/decorator/BodyParam';
import { Controller } from '../../src/decorator/Controller';
import { CookieParam } from '../../src/decorator/CookieParam';
import { Get } from '../../src/decorator/Get';
import { HeaderParam } from '../../src/decorator/HeaderParam';
import { JsonController } from '../../src/decorator/JsonController';
import { Param } from '../../src/decorator/Param';
import { Post } from '../../src/decorator/Post';
import { QueryParam } from '../../src/decorator/QueryParam';
import { QueryParams } from '../../src/decorator/QueryParams';
import { Req } from '../../src/decorator/Req';
import { Res } from '../../src/decorator/Res';
import { Session } from '../../src/decorator/Session';
import { SessionParam } from '../../src/decorator/SessionParam';
import { UploadedFile } from '../../src/decorator/UploadedFile';
import { UploadedFiles } from '../../src/decorator/UploadedFiles';
import { UseBefore } from '../../src/decorator/UseBefore';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { SessionMiddleware } from '../fakes/global-options/SessionMiddleware';
import { axios } from '../utilities/axios';
import { AxiosError } from 'axios';
import DoneCallback = jest.DoneCallback;
import { Type, Transform } from 'class-transformer';

describe(``, () => {
  let expressServer: HttpServer;
  let paramUserId: number | undefined, paramFirstId: number | undefined, paramSecondId: number | undefined;
  let sessionTestElement: string | undefined;
  let queryParamSortBy: string | undefined,
    queryParamCount: string | undefined,
    queryParamLimit: number | undefined,
    queryParamValues: any[] | undefined,
    queryParamShowAll: boolean | undefined,
    queryParamFilter: Record<string, any> | undefined;
  let queryParams1: { [key: string]: any } | undefined,
    queryParams2: { [key: string]: any } | undefined,
    queryParams3: { [key: string]: any } | undefined;
  let headerParamToken: string | undefined,
    headerParamCount: number | undefined,
    headerParamLimit: number | undefined,
    headerParamShowAll: boolean | undefined,
    headerParamFilter: Record<string, any> | undefined;
  let cookieParamToken: string | undefined,
    cookieParamCount: number | undefined,
    cookieParamLimit: number | undefined,
    cookieParamShowAll: boolean | undefined,
    cookieParamFilter: Record<string, any> | undefined;
  let body: string | undefined;
  let bodyParamName: string | undefined, bodyParamAge: number | undefined, bodyParamIsActive: boolean | undefined;
  let expressRequest: express.Request | undefined, expressResponse: express.Response | undefined;
  const urlencodedParser: any = bodyParser.urlencoded({ extended: true });

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
    expressRequest = undefined;
    expressResponse = undefined;
  });

  beforeAll(done => {
    getMetadataArgsStorage().reset();
    class NestedQueryClass {
      @Min(5)
      num: number;

      @IsString()
      str: string;

      @IsBoolean()
      isFive: boolean;
    }

    class QueryClass {
      @MaxLength(5)
      sortBy?: string;

      @IsString()
      count?: string;

      @Min(5)
      limit?: number;

      @IsBoolean()
      showAll: boolean = true;

      @ValidateNested()
      myObject: NestedQueryClass;

      @IsArray()
      @IsString({ each: true })
      multipleStringValues?: string[];

      @IsArray()
      @IsNumber(undefined, { each: true })
      @Type(() => Number)
      multipleNumberValues?: number[];

      @IsArray()
      @IsBoolean({ each: true })
      @Transform(value => (Array.isArray(value.value) ? value.value.map(v => v !== 'false') : value.value !== 'false'))
      multipleBooleanValues?: boolean[];

      @IsArray()
      @IsDate({ each: true })
      @Type(() => Date)
      multipleDateValues?: Date[];
    }

    class QueryWhitelistClass {
      @IsArray()
      @IsBoolean({ each: true })
      @Transform(value => (Array.isArray(value.value) ? value.value.map(v => v !== 'false') : value.value !== 'false'))
      multipleBooleanValues?: boolean[];
    }

    @Controller()
    class UserActionParamsController {
      @Get('/users')
      getUsers(@Req() request: express.Request, @Res() response: express.Response): string {
        expressRequest = request;
        expressResponse = response;
        return '<html><body>hello</body></html>';
      }

      @Get('/users-direct')
      getUsersDirect(@Res() response: express.Response): express.Response {
        return response.status(201).contentType('custom/x-sample').send('hi, I was written directly to the response');
      }

      @Get('/users/:userId')
      getUser(@Param('userId') userId: number): string {
        paramUserId = userId;
        return `<html><body>${userId}</body></html>`;
      }

      @Get('/users/:firstId/photos/:secondId')
      getUserPhoto(@Param('firstId') firstId: number, @Param('secondId') secondId: number): string {
        paramFirstId = firstId;
        paramSecondId = secondId;
        return `<html><body>${firstId},${secondId}</body></html>`;
      }

      @Post('/session/')
      @UseBefore(SessionMiddleware)
      addToSession(@Session() session: any): string {
        session['testElement'] = '@Session test';
        session['fakeObject'] = {
          name: 'fake',
          fake: true,
          value: 666,
        };
        return '<html><body>@Session</body></html>';
      }

      @Get('/session/')
      @UseBefore(SessionMiddleware)
      loadFromSession(@SessionParam('testElement') testElement: string): string {
        sessionTestElement = testElement;
        return `<html><body>${testElement}</body></html>`;
      }

      @Get('/not-use-session/')
      notUseSession(@SessionParam('testElement') testElement: string): string {
        sessionTestElement = testElement;
        return `<html><body>${testElement}</body></html>`;
      }

      @Get('/session-param-empty/')
      @UseBefore(SessionMiddleware)
      loadEmptyParamFromSession(@SessionParam('empty', { required: false }) emptyElement: string): string {
        sessionTestElement = emptyElement;
        return `<html><body>${emptyElement === undefined}</body></html>`;
      }

      @Get('/session-param-empty-error/')
      @UseBefore(SessionMiddleware)
      errorOnLoadEmptyParamFromSession(@SessionParam('empty', { required: true }) emptyElement: string): string {
        sessionTestElement = emptyElement;
        return `<html><body>${emptyElement === undefined}</body></html>`;
      }

      @Get('/photos')
      getPhotos(
        @QueryParam('sortBy') sortBy: string,
        @QueryParam('count') count: string,
        @QueryParam('limit') limit: number,
        @QueryParam('showAll') showAll: boolean,
      ): string {
        queryParamSortBy = sortBy;
        queryParamCount = count;
        queryParamLimit = limit;
        queryParamShowAll = showAll;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-params')
      getPhotosWithQuery(@QueryParams() query: QueryClass): string {
        queryParams1 = query;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-params-no-validate')
      getPhotosWithQueryAndNoValidation(@QueryParams({ validate: false }) query: QueryClass): string {
        queryParams2 = query;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-params-optional')
      getPhotosWithOptionalQuery(
        @QueryParams({ validate: { skipMissingProperties: true } }) query: QueryClass,
      ): string {
        queryParams3 = query;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-params-whitelist')
      getPhotosWithWhitelistQuery(
        @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } }) query: QueryWhitelistClass,
      ): string {
        queryParams3 = query;
        return `<html><body>hello</body></html>`;
      }

      @Get('/photos-with-required')
      getPhotosWithIdRequired(@QueryParam('limit', { required: true }) limit: number): string {
        queryParamLimit = limit;
        return `<html><body>${limit}</body></html>`;
      }

      @Get('/photos-query-param-string-array')
      getPhotosWithMultipleStringValuesRequired(
        @QueryParam('multipleStringValues', { required: true }) values: string[],
      ): string {
        queryParamValues = values;
        return `<html><body>${values}</body></html>`;
      }

      @Get('/photos-query-param-number-array')
      getPhotosWithMultipleNumberValuesRequired(
        @QueryParam('multipleNumberValues', { required: true, type: Number, isArray: true }) values: number[],
      ): string {
        queryParamValues = values;
        return `<html><body>${values}</body></html>`;
      }

      @Get('/photos-query-param-date-array')
      getPhotosWithMultipleDateValuesRequired(
        @QueryParam('multipleDateValues', { required: true, type: Date, isArray: true }) values: Date[],
      ): string {
        queryParamValues = values;
        return `<html><body>${values}</body></html>`;
      }

      @Get('/photos-with-json')
      getPhotosWithJsonParam(
        @QueryParam('filter', { parse: true }) filter: { keyword: string; limit: number },
      ): string {
        queryParamFilter = filter;
        return `<html><body>hello</body></html>`;
      }

      @Get('/posts')
      getPosts(
        @HeaderParam('token') token: string,
        @HeaderParam('count') count: number,
        @HeaderParam('showAll') showAll: boolean,
      ): string {
        headerParamToken = token;
        headerParamCount = count;
        headerParamShowAll = showAll;
        return `<html><body>hello</body></html>`;
      }

      @Get('/posts-with-required')
      getPostsWithIdRequired(@HeaderParam('limit', { required: true }) limit: number): string {
        headerParamLimit = limit;
        return `<html><body>${limit}</body></html>`;
      }

      @Get('/posts-with-json')
      getPostsWithJsonParam(
        @HeaderParam('filter', { parse: true }) filter: { keyword: string; limit: number },
      ): string {
        headerParamFilter = filter;
        return `<html><body>hello</body></html>`;
      }

      @Get('/questions')
      getQuestions(
        @CookieParam('token') token: string,
        @CookieParam('count') count: number,
        @CookieParam('showAll') showAll: boolean,
      ): string {
        cookieParamToken = token;
        cookieParamCount = count;
        cookieParamShowAll = showAll;
        return `<html><body>hello</body></html>`;
      }

      @Get('/questions-with-required')
      getQuestionsWithIdRequired(@CookieParam('limit', { required: true }) limit: number): string {
        cookieParamLimit = limit;
        return `<html><body>hello</body></html>`;
      }

      @Get('/questions-with-json')
      getQuestionsWithJsonParam(
        @CookieParam('filter', { parse: true }) filter: { keyword: string; limit: number },
      ): string {
        cookieParamFilter = filter;
        return `<html><body>hello</body></html>`;
      }

      @Post('/questions')
      postQuestion(@Body() question: string): string {
        body = question;
        return `<html><body>hello</body></html>`;
      }

      @Post('/questions-with-required')
      postRequiredQuestion(@Body({ required: true }) question: string): string {
        body = question;
        return `<html><body>hello</body></html>`;
      }

      @Post('/form-data-body')
      @UseBefore(urlencodedParser)
      postFormDataBody(@Body() body: any): string {
        return body.testObject.testNested.testString;
      }

      @Post('/file')
      postFile(@UploadedFile('myFile') file: Express.Multer.File): string {
        return `<html><body>${file.originalname}</body></html>`;
      }

      @Post('/file-with-body')
      postFileWithBody(@UploadedFile('myFile') file: Express.Multer.File, @Body() body: any): string {
        return `<html><body>${file.originalname} - ${JSON.stringify(body)}</body></html>`;
      }

      @Post('/file-with-body-param')
      postFileWithBodyParam(
        @UploadedFile('myFile') file: Express.Multer.File,
        @BodyParam('testParam') testParam: string,
      ): string {
        return `<html><body>${file.originalname} - ${testParam}</body></html>`;
      }

      @Post('/file-with-limit')
      postFileWithLimit(
        @UploadedFile('myFile', { options: { limits: { fileSize: 2 } } }) file: Express.Multer.File,
      ): string {
        return `<html><body>${file.originalname}</body></html>`;
      }

      @Post('/file-with-required')
      postFileWithRequired(@UploadedFile('myFile', { required: true }) file: Express.Multer.File): string {
        return `<html><body>${file.originalname}</body></html>`;
      }

      @Post('/photos')
      postPhotos(@UploadedFiles('photos') files: Express.Multer.File[]): string {
        return `<html><body>${files[0].originalname} ${files[1].originalname}</body></html>`;
      }

      @Post('/photos-with-limit')
      postPhotosWithLimit(@UploadedFiles('photos', { options: { limits: { files: 1 } } }) files: any): string {
        return `<html><body>${files[0].originalname}</body></html>`;
      }

      @Post('/photos-with-required')
      postPhotosWithRequired(@UploadedFiles('photos', { required: true }) files: any): string {
        return `<html><body>${files[0].originalname}</body></html>`;
      }
    }

    @JsonController()
    class SecondUserActionParamsController {
      @Post('/posts')
      postPost(@Body() question: any): any {
        body = question;
        return body;
      }

      @Post('/posts-with-required')
      postRequiredPost(@Body({ required: true }) post: string): any {
        body = post;
        return body;
      }

      @Get('/posts-after')
      getPostsAfter(@QueryParam('from', { required: true }) from: Date): string {
        return from.toISOString();
      }

      @Post('/users')
      postUser(
        @BodyParam('name') name: string,
        @BodyParam('age') age: number,
        @BodyParam('isActive') isActive: boolean,
      ): null {
        bodyParamName = name;
        bodyParamAge = age;
        bodyParamIsActive = isActive;
        return null;
      }

      @Post('/users-with-required')
      postUserWithRequired(
        @BodyParam('name', { required: true }) name: string,
        @BodyParam('age', { required: true }) age: number,
        @BodyParam('isActive', { required: true }) isActive: boolean,
      ): null {
        bodyParamName = name;
        bodyParamAge = age;
        bodyParamIsActive = isActive;
        return null;
      }
    }

    expressServer = createExpressServer({
      cors: {
        origin: 'http://localhost:3001',
        credentials: true,
      },
    }).listen(3001, done);
  });

  afterAll((done: DoneCallback) => {
    expressServer.close(done);
  });

  it('@Req and @Res should be provided as Request and Response objects', async () => {
    expect.assertions(4);
    const response = await axios.get('/users');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>hello</body></html>'); // apply better check here
    expect(expressResponse).toBeInstanceOf(ServerResponse); // apply better check here
  });

  it('@Res writing directly to the response should work', async () => {
    expect.assertions(3);
    const response = await axios.get('/users-direct');
    expect(response.status).toEqual(HttpStatusCodes.CREATED);
    expect(response.headers['content-type']).toEqual('custom/x-sample; charset=utf-8');
    expect(response.data).toEqual('hi, I was written directly to the response');
  });

  it('@Param should give a param from route', async () => {
    expect.assertions(4);
    const response = await axios.get('users/1');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(paramUserId).toEqual(1);
    expect(response.data).toEqual('<html><body>1</body></html>');
  });

  it('@Param multiple params should give a proper values from route', async () => {
    expect.assertions(5);
    const response = await axios.get('/users/23/photos/32');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(paramFirstId).toEqual(23);
    expect(paramSecondId).toEqual(32);
    expect(response.data).toEqual('<html><body>23,32</body></html>');
  });

  it('@SessionParam without middleware', async () => {
    expect.assertions(1);
    try {
      await axios.get('/not-use-session');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  it('@Session should return a value from session', async () => {
    expect.assertions(7);
    const response = await axios.post('/session');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>@Session</body></html>');

    const response1 = await axios.get('/session', {
      withCredentials: true,
      headers: {
        cookie: response.headers['set-cookie'][0],
      },
    });
    expect(response1.status).toEqual(HttpStatusCodes.OK);
    expect(response1.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response1.data).toEqual('<html><body>@Session test</body></html>');
    expect(sessionTestElement).toEqual('@Session test');
  });

  it('@Session(param) should allow to inject empty property', async () => {
    const response = await axios.get('/session-param-empty');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>true</body></html>');
    expect(sessionTestElement).toBeUndefined();
  });

  /*
  // This test currently fails with an ECONNRESET
  // See this Github issue:
  // https://github.com/typestack/routing-controllers/issues/243
  it("@Session(param) should throw required error when param is empty", () => {
      expect.assertions(1);
      const response = await axios.get("/session-param-empty-error", {
          withCredentials: true
      });
          // Do nothing
      }).catch((error) => {
          expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
      });
  });
  */

  it("@QueryParams should give a proper values from request's query parameters", async () => {
    expect.assertions(10);
    const response = await axios.get(
      '/photos-params?' +
        'sortBy=name&' +
        'count=2&' +
        'limit=10&' +
        'showAll&' +
        'multipleStringValues=a&' +
        'multipleStringValues=b&' +
        'multipleNumberValues=1&' +
        'multipleNumberValues=2.3&' +
        'multipleBooleanValues=false&' +
        'multipleBooleanValues=true&' +
        'multipleDateValues=2017-02-01T00:00:00Z&' +
        'multipleDateValues=2017-03-01T00:00:00Z',
    );
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams1?.sortBy).toEqual('name');
    expect(queryParams1?.count).toEqual('2');
    expect(queryParams1?.limit).toEqual(10);
    expect(queryParams1?.showAll).toEqual(true);
    expect(queryParams1?.multipleStringValues).toEqual(['a', 'b']);
    expect(queryParams1?.multipleNumberValues).toEqual([1, 2.3]);
    expect(queryParams1?.multipleBooleanValues).toEqual([false, true]);
    expect(queryParams1?.multipleDateValues).toEqual([
      new Date('2017-02-01T00:00:00Z'),
      new Date('2017-03-01T00:00:00Z'),
    ]);
  });

  it("@QueryParams should give a proper values from request's query parameters and one multiple value", async () => {
    expect.assertions(10);
    const response = await axios.get(
      '/photos-params?' +
        'sortBy=name&' +
        'count=2&' +
        'limit=10&' +
        'showAll&' +
        'multipleStringValues=a&' +
        'multipleNumberValues=1&' +
        'multipleBooleanValues=true&' +
        'multipleDateValues=2017-02-01T01:00:00Z',
    );
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams1?.sortBy).toEqual('name');
    expect(queryParams1?.count).toEqual('2');
    expect(queryParams1?.limit).toEqual(10);
    expect(queryParams1?.showAll).toEqual(true);
    expect(queryParams1?.multipleStringValues).toEqual(['a']);
    expect(queryParams1?.multipleNumberValues).toEqual([1]);
    expect(queryParams1?.multipleBooleanValues).toEqual([true]);
    expect(queryParams1?.multipleDateValues).toEqual([new Date('2017-02-01T01:00:00Z')]);
  });

  it("@QueryParams should give a proper values from request's query with validate whitelist option on", async () => {
    expect.assertions(3);
    const response = await axios.get('/photos-params-whitelist?multipleBooleanValues=false');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams3?.multipleBooleanValues).toEqual([false]);
  });

  it("@QueryParams should give a proper values from request's query parameters with nested json", async () => {
    expect.assertions(13);
    const response = await axios.get(
      '/photos-params?' +
        'sortBy=name&' +
        'count=2&' +
        'limit=10&' +
        'showAll&' +
        'myObject=%7B%22num%22%3A%205,%20%22str%22%3A%20%22five%22,%20%22isFive%22%3A%20true%7D&' +
        'multipleStringValues=a&' +
        'multipleStringValues=b&' +
        'multipleNumberValues=1&' +
        'multipleNumberValues=2.3&' +
        'multipleBooleanValues=false&' +
        'multipleBooleanValues=true&' +
        'multipleDateValues=2017-02-01T00:00:00Z',
    );
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams1?.sortBy).toEqual('name');
    expect(queryParams1?.count).toEqual('2');
    expect(queryParams1?.limit).toEqual(10);
    expect(queryParams1?.showAll).toEqual(true);
    expect(queryParams1?.myObject.num).toEqual(5);
    expect(queryParams1?.myObject.str).toEqual('five');
    expect(queryParams1?.myObject.isFive).toEqual(true);
    expect(queryParams1?.multipleStringValues).toEqual(['a', 'b']);
    expect(queryParams1?.multipleNumberValues).toEqual([1, 2.3]);
    expect(queryParams1?.multipleBooleanValues).toEqual([false, true]);
    expect(queryParams1?.multipleDateValues).toEqual([new Date('2017-02-01T00:00:00Z')]);
  });

  it("@QueryParams should not validate request query parameters when it's turned off in validator options", async () => {
    expect.assertions(6);
    const response = await axios.get('/photos-params-no-validate?sortBy=verylongtext&count=2&limit=1&showAll=true');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams2?.sortBy).toEqual('verylongtext');
    expect(queryParams2?.count).toEqual('2');
    expect(queryParams2?.limit).toEqual(1);
    expect(queryParams2?.showAll).toEqual(true);
  });

  it("@QueryParams should give a proper values from request's optional query parameters", async () => {
    expect.assertions(6);
    const response = await axios.get('/photos-params-optional?sortBy=name&limit=10');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams3?.sortBy).toEqual('name');
    expect(queryParams3?.count).toEqual(undefined);
    expect(queryParams3?.limit).toEqual(10);
    expect(queryParams3?.showAll).toEqual(true);
  });

  it('@QueryParam should give a proper values from request query parameters', async () => {
    expect.assertions(6);
    const response = await axios.get('/photos?sortBy=name&count=2&limit=10&showAll=true');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamSortBy).toEqual('name');
    expect(queryParamCount).toEqual('2');
    expect(queryParamLimit).toEqual(10);
    expect(queryParamShowAll).toEqual(true);
  });

  it('@QueryParam should give an array of string with only one query parameter', async () => {
    expect.assertions(3);
    const response = await axios.get('/photos-query-param-string-array?multipleStringValues=a');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamValues).toEqual(['a']);
  });

  it('@QueryParam should give an array of string with multiple query parameters', async () => {
    expect.assertions(3);
    const response = await axios.get(
      '/photos-query-param-string-array?multipleStringValues=a&multipleStringValues=b&multipleStringValues=b',
    );
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamValues).toEqual(['a', 'b', 'b']);
  });

  it('@QueryParam should give an array of number with only one query parameter', async () => {
    expect.assertions(3);
    const response = await axios.get('/photos-query-param-number-array?multipleNumberValues=1');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamValues).toEqual([1]);
  });

  it('@QueryParam should give an array of number with multiple query parameters', async () => {
    expect.assertions(3);
    const response = await axios.get(
      '/photos-query-param-number-array?multipleNumberValues=1&multipleNumberValues=2&multipleNumberValues=2',
    );
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamValues).toEqual([1, 2, 2]);
  });

  it('@QueryParam should give an array of date with only one query parameter', async () => {
    expect.assertions(3);
    const response = await axios.get('/photos-query-param-date-array?multipleDateValues=2021-01-01');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamValues).toEqual([new Date('2021-01-01')]);
  });

  it('@QueryParam should give an array of date with multiple query parameters', async () => {
    expect.assertions(3);
    const response = await axios.get(
      '/photos-query-param-date-array?multipleDateValues=2021-01-01&multipleDateValues=2020-01-01&multipleDateValues=2021-05-01',
    );
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamValues).toEqual([new Date('2021-01-01'), new Date('2020-01-01'), new Date('2021-05-01')]);
  });

  it('@QueryParam when required params must be provided and they should not be empty', async () => {
    expect.assertions(6);
    let response = await axios.get('/photos-with-required?limit=0');
    expect(queryParamLimit).toEqual(0);
    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>0</body></html>');

    try {
      response = await axios.get('/photos-with-required?');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }

    try {
      response = await axios.get('/photos-with-required?limit');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }
  });

  it('@QueryParam when the type is Date then it should be parsed', async () => {
    expect.assertions(2);
    const response = await axios.get('/posts-after/?from=2017-01-01T00:00:00Z');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.data).toEqual('2017-01-01T00:00:00.000Z');
  });

  it('@QueryParam when the type is Date and it is invalid then the response should be a BadRequest error', async () => {
    expect.assertions(2);
    try {
      const response = await axios.get('/posts-after/?from=InvalidDate');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
      expect(err.response?.data.name).toEqual('ParamNormalizationError');
    }
  });

  it('@QueryParam when parseJson flag is used query param must be converted to object', async () => {
    expect.assertions(3);
    const response = await axios.get('/photos-with-json/?filter={"keyword": "name", "limit": 5}');
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamFilter).toEqual({ keyword: 'name', limit: 5 });
  });

  it('@HeaderParam should give a proper values from request headers', async () => {
    const response = await axios.get('/posts', {
      headers: {
        token: '31ds31das231sad12',
        count: 20,
        showAll: false,
      },
    });
    expect(headerParamToken).toEqual('31ds31das231sad12');
    expect(headerParamCount).toEqual(20);
    expect(headerParamShowAll).toEqual(false);
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
  });

  it('@HeaderParam when required is params must be provided and they should not be empty', async () => {
    expect.assertions(3);
    const response = await axios.get('/posts-with-required', {
      headers: {
        limit: 0,
      },
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(headerParamLimit).toEqual(0);
  });

  it('@HeaderParam should fail with invalid request options', async () => {
    expect.assertions(1);
    try {
      await axios.get('/posts-with-required', {
        headers: {
          filter: '',
        },
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }
  });

  it('@HeaderParam should fail with missing required params', async () => {
    expect.assertions(1);
    try {
      await axios.get('/posts-with-required');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }
  });

  it('for @HeaderParam when parseJson flag is used query param must be converted to object', async () => {
    expect.assertions(3);
    const response = await axios.get('/posts-with-json', {
      headers: {
        filter: '{"keyword": "name", "limit": 5}',
      },
    });
    expect(headerParamFilter).toEqual({ keyword: 'name', limit: 5 });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
  });

  it('@CookieParam should give a proper values from request headers', async () => {
    expect.assertions(5);
    const response = await axios.get('/questions', {
      headers: {
        Cookie: 'token=31ds31das231sad12; count=20; showAll=false',
      },
      withCredentials: true,
    });
    expect(cookieParamToken).toEqual('31ds31das231sad12');
    expect(cookieParamCount).toEqual(20);
    expect(cookieParamShowAll).toEqual(false);
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
  });

  it('@CookieParam when required is params must be provided and they should not be empty', async () => {
    expect.assertions(4);
    let response = await axios.get('/questions-with-required', {
      headers: {
        Cookie: 'limit=20',
      },
      withCredentials: true,
    });
    expect(cookieParamLimit).toEqual(20);
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');

    try {
      response = await axios.get('questions-with-required');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }
  });

  it('@CookieParam when parseJson flag is used query param must be converted to object', async () => {
    expect.assertions(3);
    const response = await axios.get('/questions-with-json', {
      headers: {
        Cookie: 'filter={"keyword": "name", "limit": 5}',
      },
      withCredentials: true,
    });
    expect(cookieParamFilter).toEqual({ keyword: 'name', limit: 5 });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
  });

  it('@Body should provide a request body', async () => {
    expect.assertions(3);
    const response = await axios.post('/questions', 'hello', {
      headers: {
        'Content-type': 'text/plain',
      },
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>hello</body></html>');
  });

  it('@Body should fail if required body was not provided', async () => {
    expect.assertions(5);
    let response = await axios.post('/questions-with-required', '0', {
      headers: {
        'Content-type': 'text/plain',
      },
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(body).toEqual('0');

    try {
      response = await axios.post('/questions-with-required', '', {
        headers: {
          'Content-type': 'text/plain',
        },
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }

    try {
      response = await axios.post('/questions-with-required', {
        headers: {
          'Content-type': 'text/plain',
        },
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }
  });

  it('@Body should provide a json object for json-typed controllers and actions', async () => {
    expect.assertions(4);
    const response = await axios.post('/posts', { hello: 'world' });
    expect(body).toEqual({ hello: 'world' });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(response.data).toEqual(body); // should we allow to return a text body for json controllers?
  });

  it('@Body should fail if required body was not provided for json-typed controllers and actions', async () => {
    expect.assertions(2);
    let response = await axios.post('posts-with-required', { hello: '' });
    expect(response.status).toEqual(HttpStatusCodes.OK);

    try {
      response = await axios.post('posts-with-required');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }
  });

  it('@BodyParam should provide a json object for json-typed controllers and actions', async () => {
    expect.assertions(4);
    const response = await axios.post('/users', { name: 'johny', age: 27, isActive: true });
    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
    expect(bodyParamName).toEqual('johny');
    expect(bodyParamAge).toEqual(27);
    expect(bodyParamIsActive).toEqual(true);
  });

  it('@BodyParam should fail if required body was not provided for json-typed controllers and actions', async () => {
    expect.assertions(8);
    let response = await axios.post('/users-with-required', { name: 'johny', age: 27, isActive: true });
    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);

    try {
      response = await axios.post('/users-with-required');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }

    try {
      response = await axios.post('/users-with-required', { name: '', age: 27, isActive: false });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }

    response = await axios.post('/users-with-required', { name: 'Johny', age: 0, isActive: false });
    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);

    try {
      response = await axios.post('/users-with-required', { name: 'Johny', age: undefined, isActive: false });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }

    try {
      response = await axios.post('/users-with-required', { name: 'Johny', age: 27, isActive: undefined });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }

    response = await axios.post('/users-with-required', { name: 'Johny', age: 27, isActive: false });
    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);

    response = await axios.post('/users-with-required', { name: 'Johny', age: 27, isActive: true });
    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
  });

  it('@Body using application/x-www-form-urlencoded should handle url encoded form data', async () => {
    expect.assertions(3);
    const response = await axios.post(
      '/form-data-body',
      qs.stringify({
        testObject: {
          testNested: {
            testString: 'this is a urlencoded form-data test',
            testNumber: 5,
          },
        },
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('this is a urlencoded form-data test');
  });

  it('@UploadedFile using multipart/form-data should provide uploaded file with the given name', async () => {
    expect.assertions(3);
    const form = new FormData();
    form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
    const response = await axios.post('/file', form, {
      headers: form.getHeaders(),
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>sample-text-file.txt</body></html>');
  });

  it('@UploadedFile with @Body should return both the file and the body', async () => {
    expect.assertions(3);
    const form = new FormData();
    form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
    form.append('anotherField', 'hello');
    form.append('andAnother', 'world');
    const response = await axios.post('/file-with-body', form, {
      headers: form.getHeaders(),
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual(
      `<html><body>sample-text-file.txt - {"anotherField":"hello","andAnother":"world"}</body></html>`,
    );
  });

  it('@UploadedFile with @BodyParam should return both the file and the body param', async () => {
    expect.assertions(3);
    const form = new FormData();
    form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
    form.append('testParam', 'testParamOne');
    const response = await axios.post('/file-with-body-param', form, {
      headers: form.getHeaders(),
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual(`<html><body>sample-text-file.txt - testParamOne</body></html>`);
  });

  it('@UploadedFile with passed uploading options (limit) should throw an error', async () => {
    expect.assertions(1);
    const form = new FormData();
    form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));

    try {
      const response = await axios.post('/file-with-limit', form, {
        headers: form.getHeaders(),
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  it('@UploadedFile when required is used files must be provided', async () => {
    expect.assertions(4);
    const form = new FormData();
    form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));

    let response = await axios.post('/file-with-required', form, {
      headers: form.getHeaders(),
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>sample-text-file.txt</body></html>');

    try {
      response = await axios.post('/file-with-required', undefined, {
        headers: form.getHeaders(),
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }
  });

  it('@UploadedFiles should provide uploaded files with the given name', async () => {
    expect.assertions(3);
    const form = new FormData();
    form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
    form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
    const response = await axios.post('/photos', form, {
      headers: form.getHeaders(),
    });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>sample-text-file.txt sample-text-file.txt</body></html>');
  });

  it('@UploadedFiles with passed uploading options (limit) should throw an error', async () => {
    expect.assertions(1);
    const form = new FormData();
    form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
    form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));

    try {
      const response = await axios.post('/photos-with-limit', form, {
        headers: form.getHeaders(),
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  it('@UploadedFiles when required is used files must be provided', async () => {
    expect.assertions(1);
    const form = new FormData();

    try {
      const response = await axios.post('/photos-with-required', undefined, {
        headers: form.getHeaders(),
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
});

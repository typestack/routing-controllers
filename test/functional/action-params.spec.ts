import 'reflect-metadata';
import fs from 'fs';
import qs from 'qs';
import FormData from 'form-data';
import { IsString, IsBoolean, Min, MaxLength, ValidateNested } from 'class-validator';
import { getMetadataArgsStorage, createExpressServer } from '../../src/index';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Req } from '../../src/decorator/Req';
import { Res } from '../../src/decorator/Res';
import { Param } from '../../src/decorator/Param';
import { Post } from '../../src/decorator/Post';
import { UseBefore } from '../../src/decorator/UseBefore';
import { Session } from '../../src/decorator/Session';
import { SessionParam } from '../../src/decorator/SessionParam';
import { QueryParam } from '../../src/decorator/QueryParam';
import { QueryParams } from '../../src/decorator/QueryParams';
import { HeaderParam } from '../../src/decorator/HeaderParam';
import { CookieParam } from '../../src/decorator/CookieParam';
import { Body } from '../../src/decorator/Body';
import { BodyParam } from '../../src/decorator/BodyParam';
import { UploadedFile } from '../../src/decorator/UploadedFile';
import { UploadedFiles } from '../../src/decorator/UploadedFiles';
import { JsonController } from '../../src/decorator/JsonController';
import { AxiosError, AxiosResponse } from 'axios';
import HttpStatusCodes from 'http-status-codes';
import { SessionMiddleware } from '../fakes/global-options/SessionMiddleware';
import bodyParser from 'body-parser';
import DoneCallback = jest.DoneCallback;
import path from 'path';
import { Server as HttpServer, ServerResponse } from 'http';
import express from 'express';
import { axios } from '../utilities/axios';

let expressServer: HttpServer;
let paramUserId: number | undefined, paramFirstId: number | undefined, paramSecondId: number | undefined;
let sessionTestElement: string | undefined;
let queryParamSortBy: string | undefined,
  queryParamCount: string | undefined,
  queryParamLimit: number | undefined,
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
      @QueryParam('showAll') showAll: boolean
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
    getPhotosWithOptionalQuery(@QueryParams({ validate: { skipMissingProperties: true } }) query: QueryClass): string {
      queryParams3 = query;
      return `<html><body>hello</body></html>`;
    }

    @Get('/photos-with-required')
    getPhotosWithIdRequired(@QueryParam('limit', { required: true }) limit: number): string {
      queryParamLimit = limit;
      return `<html><body>${limit}</body></html>`;
    }

    @Get('/photos-with-json')
    getPhotosWithJsonParam(@QueryParam('filter', { parse: true }) filter: { keyword: string; limit: number }): string {
      queryParamFilter = filter;
      return `<html><body>hello</body></html>`;
    }

    @Get('/posts')
    getPosts(
      @HeaderParam('token') token: string,
      @HeaderParam('count') count: number,
      @HeaderParam('showAll') showAll: boolean
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
    getPostsWithJsonParam(@HeaderParam('filter', { parse: true }) filter: { keyword: string; limit: number }): string {
      headerParamFilter = filter;
      return `<html><body>hello</body></html>`;
    }

    @Get('/questions')
    getQuestions(
      @CookieParam('token') token: string,
      @CookieParam('count') count: number,
      @CookieParam('showAll') showAll: boolean
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
      @CookieParam('filter', { parse: true }) filter: { keyword: string; limit: number }
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
      @BodyParam('testParam') testParam: string
    ): string {
      return `<html><body>${file.originalname} - ${testParam}</body></html>`;
    }

    @Post('/file-with-limit')
    postFileWithLimit(
      @UploadedFile('myFile', { options: { limits: { fileSize: 2 } } }) file: Express.Multer.File
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
      @BodyParam('isActive') isActive: boolean
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
      @BodyParam('isActive', { required: true }) isActive: boolean
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
afterAll((done: DoneCallback) => expressServer.close(done));

it('@Req and @Res should be provided as Request and Response objects', () => {
  expect.assertions(4);
  return axios.get('/users').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>hello</body></html>'); // apply better check here
    expect(expressResponse).toBeInstanceOf(ServerResponse); // apply better check here
  });
});

it('@Res writing directly to the response should work', () => {
  expect.assertions(3);
  return axios.get('/users-direct').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.CREATED);
    expect(response.headers['content-type']).toEqual('custom/x-sample; charset=utf-8');
    expect(response.data).toEqual('hi, I was written directly to the response');
  });
});

it('@Param should give a param from route', () => {
  expect.assertions(4);
  return axios.get('users/1').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(paramUserId).toEqual(1);
    expect(response.data).toEqual('<html><body>1</body></html>');
  });
});

it('@Param multiple params should give a proper values from route', () => {
  expect.assertions(5);
  return axios.get('/users/23/photos/32').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(paramFirstId).toEqual(23);
    expect(paramSecondId).toEqual(32);
    expect(response.data).toEqual('<html><body>23,32</body></html>');
  });
});

it('@SessionParam without middleware', () => {
  expect.assertions(1);
  return axios.get('/not-use-session').catch((error: AxiosError) => {
    expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });
});

it('@Session should return a value from session', () => {
  expect.assertions(7);
  return axios.post('/session').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>@Session</body></html>');
    return axios
      .get('/session', {
        withCredentials: true,
        headers: {
          cookie: response.headers['set-cookie'][0],
        },
      })
      .then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
        expect(response.data).toEqual('<html><body>@Session test</body></html>');
        expect(sessionTestElement).toEqual('@Session test');
      });
  });
});

it('@Session(param) should allow to inject empty property', () => {
  return axios.get('/session-param-empty').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(response.data).toEqual('<html><body>true</body></html>');
    expect(sessionTestElement).toBeUndefined();
  });
});

/*
// This test currently fails with an ECONNRESET
// See this Github issue:
// https://github.com/typestack/routing-controllers/issues/243
it("@Session(param) should throw required error when param is empty", () => {
    expect.assertions(1);
    return axios.get("/session-param-empty-error", {
        withCredentials: true
    }).then((response: AxiosResponse) => {
        // Do nothing
    }).catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    });
});
*/

it("@QueryParams should give a proper values from request's query parameters", () => {
  expect.assertions(6);
  return axios.get('/photos-params?sortBy=name&count=2&limit=10&showAll').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams1.sortBy).toEqual('name');
    expect(queryParams1.count).toEqual('2');
    expect(queryParams1.limit).toEqual(10);
    expect(queryParams1.showAll).toEqual(true);
  });
});

it("@QueryParams should give a proper values from request's query parameters with nested json", () => {
  expect.assertions(9);
  return axios
    .get(
      '/photos-params?sortBy=name&count=2&limit=10&showAll&myObject=%7B%22num%22%3A%205,%20%22str%22%3A%20%22five%22,%20%22isFive%22%3A%20true%7D'
    )
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(queryParams1.sortBy).toEqual('name');
      expect(queryParams1.count).toEqual('2');
      expect(queryParams1.limit).toEqual(10);
      expect(queryParams1.showAll).toEqual(true);
      expect(queryParams1.myObject.num).toEqual(5);
      expect(queryParams1.myObject.str).toEqual('five');
      expect(queryParams1.myObject.isFive).toEqual(true);
    });
});

it("@QueryParams should not validate request query parameters when it's turned off in validator options", () => {
  expect.assertions(6);
  return axios
    .get('/photos-params-no-validate?sortBy=verylongtext&count=2&limit=1&showAll=true')
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(queryParams2.sortBy).toEqual('verylongtext');
      expect(queryParams2.count).toEqual('2');
      expect(queryParams2.limit).toEqual(1);
      expect(queryParams2.showAll).toEqual(true);
    });
});

it("@QueryParams should give a proper values from request's optional query parameters", () => {
  expect.assertions(6);
  return axios.get('/photos-params-optional?sortBy=name&limit=10').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParams3.sortBy).toEqual('name');
    expect(queryParams3.count).toEqual(undefined);
    expect(queryParams3.limit).toEqual(10);
    expect(queryParams3.showAll).toEqual(true);
  });
});

it('@QueryParam should give a proper values from request query parameters', () => {
  expect.assertions(6);
  return axios.get('/photos?sortBy=name&count=2&limit=10&showAll=true').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamSortBy).toEqual('name');
    expect(queryParamCount).toEqual('2');
    expect(queryParamLimit).toEqual(10);
    expect(queryParamShowAll).toEqual(true);
  });
});

it('@QueryParam when required params must be provided and they should not be empty', () => {
  expect.assertions(6);
  return Promise.all<AxiosResponse | void>([
    axios.get('/photos-with-required?limit=0').then((response: AxiosResponse) => {
      expect(queryParamLimit).toEqual(0);
      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>0</body></html>');
    }),
    axios.get('/photos-with-required?').catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }),
    axios.get('/photos-with-required?limit').catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }),
  ]);
});

it('@QueryParam when the type is Date then it should be parsed', () => {
  expect.assertions(2);
  return axios.get('/posts-after/?from=2017-01-01T00:00:00Z').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.data).toEqual('2017-01-01T00:00:00.000Z');
  });
});

it('@QueryParam when the type is Date and it is invalid then the response should be a BadRequest error', () => {
  expect.assertions(2);
  return axios.get('/posts-after/?from=InvalidDate').catch((error: AxiosError) => {
    expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    expect(error.response.data.name).toEqual('ParamNormalizationError');
  });
});

it('@QueryParam when parseJson flag is used query param must be converted to object', () => {
  expect.assertions(3);
  return axios.get('/photos-with-json/?filter={"keyword": "name", "limit": 5}').then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    expect(queryParamFilter).toEqual({ keyword: 'name', limit: 5 });
  });
});

it('@HeaderParam should give a proper values from request headers', () => {
  return axios
    .get('/posts', {
      headers: {
        token: '31ds31das231sad12',
        count: 20,
        showAll: false,
      },
    })
    .then((response: AxiosResponse) => {
      expect(headerParamToken).toEqual('31ds31das231sad12');
      expect(headerParamCount).toEqual(20);
      expect(headerParamShowAll).toEqual(false);
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    });
});

it('@HeaderParam when required is params must be provided and they should not be empty', () => {
  expect.assertions(3);
  return axios
    .get('/posts-with-required', {
      headers: {
        limit: 0,
      },
    })
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(headerParamLimit).toEqual(0);
    });
});

it('@HeaderParam should fail with invalid request options', () => {
  expect.assertions(1);
  return axios
    .get('/posts-with-required', {
      headers: {
        filter: '',
      },
    })
    .catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    });
});

it('@HeaderParam should fail with missing required params', () => {
  expect.assertions(1);
  return axios.get('/posts-with-required').catch((error: AxiosError) => {
    expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
  });
});

it('for @HeaderParam when parseJson flag is used query param must be converted to object', () => {
  expect.assertions(3);
  return axios
    .get('/posts-with-json', {
      headers: {
        filter: '{"keyword": "name", "limit": 5}',
      },
    })
    .then((response: AxiosResponse) => {
      expect(headerParamFilter).toEqual({ keyword: 'name', limit: 5 });
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    });
});

it('@CookieParam should give a proper values from request headers', () => {
  expect.assertions(5);
  return axios
    .get('/questions', {
      headers: {
        Cookie: 'token=31ds31das231sad12; count=20; showAll=false',
      },
      withCredentials: true,
    })
    .then((response: AxiosResponse) => {
      expect(cookieParamToken).toEqual('31ds31das231sad12');
      expect(cookieParamCount).toEqual(20);
      expect(cookieParamShowAll).toEqual(false);
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    });
});

it('@CookieParam when required is params must be provided and they should not be empty', () => {
  expect.assertions(4);
  return Promise.all<AxiosResponse | void>([
    axios
      .get('/questions-with-required', {
        headers: {
          Cookie: 'limit=20',
        },
        withCredentials: true,
      })
      .then((response: AxiosResponse) => {
        expect(cookieParamLimit).toEqual(20);
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      }),
    axios.get('questions-with-required').catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }),
  ]);
});

it('@CookieParam when parseJson flag is used query param must be converted to object', () => {
  expect.assertions(3);
  return axios
    .get('/questions-with-json', {
      headers: {
        Cookie: 'filter={"keyword": "name", "limit": 5}',
      },
      withCredentials: true,
    })
    .then((response: AxiosResponse) => {
      expect(cookieParamFilter).toEqual({ keyword: 'name', limit: 5 });
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
    });
});

it('@Body should provide a request body', () => {
  expect.assertions(3);
  return axios
    .post('/questions', 'hello', {
      headers: {
        'Content-type': 'text/plain',
      },
    })
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>hello</body></html>');
    });
});

it('@Body should fail if required body was not provided', () => {
  expect.assertions(5);
  return Promise.all<AxiosResponse | void>([
    axios
      .post('/questions-with-required', '0', {
        headers: {
          'Content-type': 'text/plain',
        },
      })
      .then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
        expect(body).toEqual('0');
      }),
    axios
      .post('/questions-with-required', '', {
        headers: {
          'Content-type': 'text/plain',
        },
      })
      .catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
      }),
    axios
      .post('/questions-with-required', {
        headers: {
          'Content-type': 'text/plain',
        },
      })
      .catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
      }),
  ]);
});

it('@Body should provide a json object for json-typed controllers and actions', () => {
  expect.assertions(4);
  return axios.post('/posts', { hello: 'world' }).then((response: AxiosResponse) => {
    expect(body).toEqual({ hello: 'world' });
    expect(response.status).toEqual(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(response.data).toEqual(body); // should we allow to return a text body for json controllers?
  });
});

it('@Body should fail if required body was not provided for json-typed controllers and actions', () => {
  expect.assertions(2);
  return Promise.all<AxiosResponse | void>([
    axios.post('posts-with-required', { hello: '' }).then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
    }),
    axios.post('posts-with-required').catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }),
  ]);
});

it('@BodyParam should provide a json object for json-typed controllers and actions', () => {
  expect.assertions(4);
  return axios.post('/users', { name: 'johny', age: 27, isActive: true }).then((response: AxiosResponse) => {
    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
    expect(bodyParamName).toEqual('johny');
    expect(bodyParamAge).toEqual(27);
    expect(bodyParamIsActive).toEqual(true);
  });
});

it('@BodyParam should fail if required body was not provided for json-typed controllers and actions', () => {
  expect.assertions(8);
  return Promise.all<AxiosResponse | void>([
    axios.post('/users-with-required', { name: 'johny', age: 27, isActive: true }).then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
    }),
    axios.post('/users-with-required').catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }),
    axios.post('/users-with-required', { name: '', age: 27, isActive: false }).catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }),
    axios.post('/users-with-required', { name: 'Johny', age: 0, isActive: false }).then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
    }),
    axios
      .post('/users-with-required', { name: 'Johny', age: undefined, isActive: false })
      .catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
      }),
    axios.post('/users-with-required', { name: 'Johny', age: 27, isActive: undefined }).catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
    }),
    axios.post('/users-with-required', { name: 'Johny', age: 27, isActive: false }).then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
    }),
    axios.post('/users-with-required', { name: 'Johny', age: 27, isActive: true }).then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
    }),
  ]);
});

it('@Body using application/x-www-form-urlencoded should handle url encoded form data', () => {
  expect.assertions(3);
  return axios
    .post(
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
      }
    )
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('this is a urlencoded form-data test');
    });
});

it('@UploadedFile using multipart/form-data should provide uploaded file with the given name', () => {
  expect.assertions(3);
  const form = new FormData();
  form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  return axios
    .post('/file', form, {
      headers: form.getHeaders(),
    })
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>sample-text-file.txt</body></html>');
    });
});

it('@UploadedFile with @Body should return both the file and the body', () => {
  expect.assertions(3);
  const form = new FormData();
  form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  form.append('anotherField', 'hello');
  form.append('andAnother', 'world');
  return axios
    .post('/file-with-body', form, {
      headers: form.getHeaders(),
    })
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual(
        `<html><body>sample-text-file.txt - {"anotherField":"hello","andAnother":"world"}</body></html>`
      );
    });
});

it('@UploadedFile with @BodyParam should return both the file and the body param', () => {
  expect.assertions(3);
  const form = new FormData();
  form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  form.append('testParam', 'testParamOne');
  return axios
    .post('/file-with-body-param', form, {
      headers: form.getHeaders(),
    })
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual(`<html><body>sample-text-file.txt - testParamOne</body></html>`);
    });
});

it('@UploadedFile with passed uploading options (limit) should throw an error', () => {
  expect.assertions(1);
  const form = new FormData();
  form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  return axios
    .post('/file-with-limit', form, {
      headers: form.getHeaders(),
    })
    .catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
});

it('@UploadedFile when required is used files must be provided', () => {
  expect.assertions(4);
  const form = new FormData();
  form.append('myFile', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  return Promise.all<AxiosResponse | void>([
    axios
      .post('/file-with-required', form, {
        headers: form.getHeaders(),
      })
      .then((response: AxiosResponse) => {
        expect(response.status).toEqual(HttpStatusCodes.OK);
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
        expect(response.data).toEqual('<html><body>sample-text-file.txt</body></html>');
      }),
    axios
      .post('/file-with-required', undefined, {
        headers: form.getHeaders(),
      })
      .catch((error: AxiosError) => {
        expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
      }),
  ]);
});

it('@UploadedFiles should provide uploaded files with the given name', () => {
  expect.assertions(3);
  const form = new FormData();
  form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  return axios
    .post('/photos', form, {
      headers: form.getHeaders(),
    })
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>sample-text-file.txt sample-text-file.txt</body></html>');
    });
});

it('@UploadedFiles with passed uploading options (limit) should throw an error', () => {
  expect.assertions(1);
  const form = new FormData();
  form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  form.append('photos', fs.createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt')));
  return axios
    .post('/photos-with-limit', form, {
      headers: form.getHeaders(),
    })
    .catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
});

it('@UploadedFiles when required is used files must be provided', () => {
  expect.assertions(1);
  const form = new FormData();
  return axios
    .post('/photos-with-required', undefined, {
      headers: form.getHeaders(),
    })
    .catch((error: AxiosError) => {
      expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
});

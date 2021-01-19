# routing-controllers

![Build Status](https://github.com/typestack/routing-controllers/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/typestack/routing-controllers/branch/develop/graph/badge.svg)](https://codecov.io/gh/typestack/routing-controllers)
[![npm version](https://badge.fury.io/js/routing-controllers.svg)](https://badge.fury.io/js/routing-controllers)
[![Dependency Status](https://david-dm.org/typestack/routing-controllers.svg)](https://david-dm.org/typestack/routing-controllers)

<center>
<span>English</span> | 
[中文](./docs/lang/chinese/README.md)
</center>

Allows to create controller classes with methods as actions that handle requests.
You can use routing-controllers with [express.js][1] or [koa.js][2].

# Table of Contents

- [Installation](#installation)
- [Example of usage](#example-of-usage)
- [More examples](#more-examples)
  - [Working with json](#working-with-json)
  - [Return promises](#return-promises)
  - [Using Request and Response objects](#using-request-and-response-objects)
  - [Pre-configure express/koa](#pre-configure-expresskoa)
  - [Load all controllers from the given directory](#load-all-controllers-from-the-given-directory)
  - [Prefix all controllers routes](#prefix-all-controllers-routes)
  - [Prefix controller with base route](#prefix-controller-with-base-route)
  - [Inject routing parameters](#inject-routing-parameters)
  - [Inject query parameters](#inject-query-parameters)
  - [Inject request body](#inject-request-body)
  - [Inject request body parameters](#inject-request-body-parameters)
  - [Inject request header parameters](#inject-request-header-parameters)
  - [Inject cookie parameters](#inject-cookie-parameters)
  - [Inject session object](#inject-session-object)
  - [Inject state object](#inject-state-object)
  - [Inject uploaded file](#inject-uploaded-file)
  - [Make parameter required](#make-parameter-required)
  - [Convert parameters to objects](#convert-parameters-to-objects)
  - [Set custom ContentType](#set-custom-contenttype)
  - [Set Location](#set-location)
  - [Set Redirect](#set-redirect)
  - [Set custom HTTP code](#set-custom-http-code)
  - [Controlling empty responses](#controlling-empty-responses)
  - [Set custom headers](#set-custom-headers)
  - [Render templates](#render-templates)
  - [Throw HTTP errors](#throw-http-errors)
  - [Enable CORS](#enable-cors)
  - [Default settings](#default-settings)
  - [Selectively disabling request/response transform](#selectively-disable-requestresponse-transforming)
- [Using middlewares](#using-middlewares)
  - [Use exist middleware](#use-exist-middleware)
  - [Creating your own express middleware](#creating-your-own-express-middleware)
  - [Creating your own koa middleware](#creating-your-own-koa-middleware)
  - [Global middlewares](#global-middlewares)
  - [Error handlers](#error-handlers)
  - [Loading middlewares and controllers from directories](#loading-middlewares-and-controllers-from-directories)
- [Using interceptors](#using-interceptors)
  - [Interceptor function](#interceptor-function)
  - [Interceptor classes](#interceptor-classes)
  - [Global interceptors](#global-interceptors)
- [Creating instances of classes from action params](#creating-instances-of-classes-from-action-params)
- [Controller inheritance](#controller-inheritance)
- [Auto validating action params](#auto-validating-action-params)
- [Using authorization features](#using-authorization-features)
  - [@Authorized decorator](#authorized-decorator)
  - [@CurrentUser decorator](#currentuser-decorator)
- [Using DI container](#using-di-container)
- [Custom parameter decorators](#custom-parameter-decorators)
- [Decorators Reference](#decorators-reference)
  - [Controller Decorators](#controller-decorators)
  - [Controller Method Decorators](#controller-method-decorators)
  - [Method Parameter Decorators](#method-parameter-decorators)
  - [Middleware And Interceptor Decorators](#middleware-and-interceptor-decorators)
  - [Other Decorators](#other-decorators)
- [Samples](#samples)
- [Release notes](#release-notes)

## Installation

1. Install module:

   `npm install routing-controllers`

2. `reflect-metadata` shim is required:

   `npm install reflect-metadata`

   and make sure to import it before you use routing-controllers:

   ```typescript
   ```

3. Install framework:

   **a. If you want to use routing-controllers with _express.js_, then install it and all required dependencies:**

   `npm install express body-parser multer`

   Optionally you can also install their typings:

   `npm install -D @types/express @types/body-parser @types/multer`

   **b. If you want to use routing-controllers with _koa 2_, then install it and all required dependencies:**

   `npm install koa koa-router koa-bodyparser koa-multer`

   Optionally you can also install their typings:

   `npm install -D @types/koa @types/koa-router @types/koa-bodyparser`

4. Install peer dependencies:

`npm install class-transformer class-validator`

In prior versions, these were direct dependencies, but now they are peer dependencies so you can choose when to upgrade and accept breaking changes.

5. Its important to set these options in `tsconfig.json` file of your project:

   ```json
   {
     "emitDecoratorMetadata": true,
     "experimentalDecorators": true
   }
   ```

## Example of usage

1. Create a file `UserController.ts`

   ```typescript
   import { Controller, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';

   @Controller()
   export class UserController {
     @Get('/users')
     getAll() {
       return 'This action returns all users';
     }

     @Get('/users/:id')
     getOne(@Param('id') id: number) {
       return 'This action returns user #' + id;
     }

     @Post('/users')
     post(@Body() user: any) {
       return 'Saving user...';
     }

     @Put('/users/:id')
     put(@Param('id') id: number, @Body() user: any) {
       return 'Updating a user...';
     }

     @Delete('/users/:id')
     remove(@Param('id') id: number) {
       return 'Removing user...';
     }
   }
   ```

   This class will register routes specified in method decorators in your server framework (express.js or koa).

2. Create a file `app.ts`

   ```typescript
   // this shim is required
   import { createExpressServer } from 'routing-controllers';
   import { UserController } from './UserController';

   // creates express app, registers all controller routes and returns you express app instance
   const app = createExpressServer({
     controllers: [UserController], // we specify controllers we want to use
   });

   // run express application on port 3000
   app.listen(3000);
   ```

   > if you are koa user you just need to use `createKoaServer` instead of `createExpressServer`

3. Open in browser `http://localhost:3000/users`. You will see `This action returns all users` in your browser.
   If you open `http://localhost:3000/users/1` you will see `This action returns user #1`.

## More examples

#### Working with json

If you are designing a REST API where your endpoints always receive and return JSON then
you can use `@JsonController` decorator instead of `@Controller`.
This will guarantee you that data returned by your controller actions always be transformed to JSON
and `Content-Type` header will be always set to `application/json`.
It will also guarantee `application/json` header is understood from the requests and the body parsed as JSON:

```typescript
import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';

@JsonController()
export class UserController {
  @Get('/users')
  getAll() {
    return userRepository.findAll();
  }

  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    return userRepository.findById(id);
  }

  @Post('/users')
  post(@Body() user: User) {
    return userRepository.insert(user);
  }
}
```

#### Return promises

You can return a promise in the controller, and it will wait until promise resolved and return promise result in a response body.

```typescript
import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';

@JsonController()
export class UserController {
  @Get('/users')
  getAll() {
    return userRepository.findAll();
  }

  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    return userRepository.findById(id);
  }

  @Post('/users')
  post(@Body() user: User) {
    return userRepository.insert(user);
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: User) {
    return userRepository.updateById(id, user);
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number) {
    return userRepository.removeById(id);
  }
}
```

#### Using Request and Response objects

You can use framework's request and response objects directly. If you want to handle the response by yourself,
just make sure you return the response object itself from the action.

```typescript
import { Controller, Req, Res, Get } from 'routing-controllers';

@Controller()
export class UserController {
  @Get('/users')
  getAllUsers(@Req() request: any, @Res() response: any) {
    return response.send('Hello response!');
  }

  @Get('/posts')
  getAllPosts(@Req() request: any, @Res() response: any) {
    // some response functions don't return the response object,
    // so it needs to be returned explicitly
    response.redirect('/users');

    return response;
  }
}
```

`@Req()` decorator injects you a `Request` object, and `@Res()` decorator injects you a `Response` object.
If you have installed typings, you can use their types:

```typescript
import { Request, Response } from 'express';
import { Controller, Req, Res, Get } from 'routing-controllers';

@Controller()
export class UserController {
  @Get('/users')
  getAll(@Req() request: Request, @Res() response: Response) {
    return response.send('Hello response!');
  }
}
```

> note: koa users can also use `@Ctx() context` to inject koa's Context object.

#### Pre-configure express/koa

If you have, or if you want to create and configure express app separately,
you can use `useExpressServer` instead of `createExpressServer` function:

```typescript
import { useExpressServer } from 'routing-controllers';

let express = require('express'); // or you can import it if you have installed typings
let app = express(); // your created express server
// app.use() // you can configure it the way you want
useExpressServer(app, {
  // register created express server in routing-controllers
  controllers: [UserController], // and configure it the way you need (controllers, validation, etc.)
});
app.listen(3000); // run your express server
```

> koa users must use `useKoaServer` instead of `useExpressServer`

#### Load all controllers from the given directory

You can load all controllers from directories, by specifying array of directories in options of
`createExpressServer` or `useExpressServer`:

```typescript
import { createExpressServer } from 'routing-controllers';

createExpressServer({
  controllers: [__dirname + '/controllers/*.js'],
}).listen(3000); // register controllers routes in our express application
```

> koa users must use `createKoaServer` instead of `createExpressServer`

#### Prefix all controllers routes

If you want to prefix all your routes, e.g. `/api` you can use `routePrefix` option:

```typescript
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController';

createExpressServer({
  routePrefix: '/api',
  controllers: [UserController],
}).listen(3000);
```

> koa users must use `createKoaServer` instead of `createExpressServer`

#### Prefix controller with base route

You can prefix all specific controller's actions with base route:

```typescript
@Controller('/users')
export class UserController {
  // ...
}
```

#### Inject routing parameters

You can use `@Param` decorator to inject parameters in your controller actions:

```typescript
@Get("/users/:id")
getOne(@Param("id") id: number) { // id will be automatically casted to "number" because it has type number
}
```

If you want to inject all parameters use `@Params()` decorator.

#### Inject query parameters

To inject query parameters, use `@QueryParam` decorator:

```typescript
@Get("/users")
getUsers(@QueryParam("limit") limit: number) {
}
```

If you want to inject all query parameters use `@QueryParams()` decorator.
The bigest benefit of this approach is that you can perform validation of the params.

```typescript
enum Roles {
    Admin = "admin",
    User = "user",
    Guest = "guest",
}

class GetUsersQuery {

    @IsPositive()
    limit: number;

    @IsAlpha()
    city: string;

    @IsEnum(Roles)
    role: Roles;

    @IsBoolean()
    isActive: boolean;

}

@Get("/users")
getUsers(@QueryParams() query: GetUsersQuery) {
    // here you can access query.role, query.limit
    // and others valid query parameters
}
```

#### Inject request body

To inject request body, use `@Body` decorator:

```typescript
@Post("/users")
saveUser(@Body() user: User) {
}
```

If you specify a class type to parameter that is decorated with `@Body()`,
routing-controllers will use [class-transformer][4] to create instance of the given class type from the data received in request body.
To disable this behaviour you need to specify a `{ classTransformer: false }` in RoutingControllerOptions when creating a server.

#### Inject request body parameters

To inject request body parameter, use `@BodyParam` decorator:

```typescript
@Post("/users")
saveUser(@BodyParam("name") userName: string) {
}
```

#### Inject request header parameters

To inject request header parameter, use `@HeaderParam` decorator:

```typescript
@Post("/users")
saveUser(@HeaderParam("authorization") token: string) {
}
```

If you want to inject all header parameters use `@HeaderParams()` decorator.

#### Inject cookie parameters

To get a cookie parameter, use `@CookieParam` decorator:

```typescript
@Get("/users")
getUsers(@CookieParam("username") username: string) {
}
```

If you want to inject all header parameters use `@CookieParams()` decorator.

#### Inject session object

To inject a session value, use `@SessionParam` decorator:

```typescript
@Get("/login")
savePost(@SessionParam("user") user: User, @Body() post: Post) {}
```

If you want to inject the main session object, use `@Session()` without any parameters.

```typescript
@Get("/login")
savePost(@Session() session: any, @Body() post: Post) {}
```

The parameter marked with `@Session` decorator is required by default. If your action param is optional, you have to mark it as not required:

```typescript
action(@Session("user", { required: false }) user: User) {}
```

Express uses [express-session][5] / Koa uses [koa-session][6] or [koa-generic-session][7] to handle session, so firstly you have to install it manually to use `@Session` decorator.

#### Inject state object

To inject a state parameter use `@State` decorator:

```typescript
@Get("/login")
savePost(@State("user") user: User, @Body() post: Post) {
}
```

If you want to inject the whole state object use `@State()` without any parameters.
This feature is only supported by Koa.

#### Inject uploaded file

To inject uploaded file, use `@UploadedFile` decorator:

```typescript
@Post("/files")
saveFile(@UploadedFile("fileName") file: any) {
}
```

You can also specify uploading options to multer this way:

```typescript
// to keep code clean better to extract this function into separate file
export const fileUploadOptions = () => {
    storage: multer.diskStorage({
        destination: (req: any, file: any, cb: any) => { ...
        },
        filename: (req: any, file: any, cb: any) => { ...
        }
    }),
    fileFilter: (req: any, file: any, cb: any) => { ...
    },
    limits: {
        fieldNameSize: 255,
        fileSize: 1024 * 1024 * 2
    }
};

// use options this way:
@Post("/files")
saveFile(@UploadedFile("fileName", { options: fileUploadOptions }) file: any) {
}
```

To inject all uploaded files use `@UploadedFiles` decorator instead.
Routing-controllers uses [multer][3] to handle file uploads.
You can install multer's file definitions via typings, and use `files: File[]` type instead of `any[]`.

#### Make parameter required

To make any parameter required, simply pass a `required: true` flag in its options:

```typescript
@Post("/users")
save(@Body({ required: true }) user: any) {
    // your method will not be executed if user is not sent in a request
}
```

Same you can do with all other parameters `@QueryParam`, `@BodyParam` and others.
If user request does not contain required parameter routing-controllers will throw an error.

#### Convert parameters to objects

If you specify a class type to parameter that is decorated with parameter decorator,
routing-controllers will use [class-transformer][4] to create instance of that class type.
More info about this feature is available [here](#creating-instances-of-classes-from-action-params).

#### Set custom ContentType

You can specify a custom ContentType header:

```typescript
@Get("/users")
@ContentType("text/csv")
getUsers() {
    // ...
}
```

#### Set Location

You can set a Location header for any action:

```typescript
@Get("/users")
@Location("http://github.com")
getUsers() {
    // ...
}
```

#### Set Redirect

You can set a Redirect header for any action:

```typescript
@Get("/users")
@Redirect("http://github.com")
getUsers() {
    // ...
}
```

You can override the Redirect header by returning a string value:

```typescript
@Get("/users")
@Redirect("http://github.com")
getUsers() {
    return "https://www.google.com";
}
```

You can use template to generate the Redirect header:

```typescript
@Get("/users")
@Redirect("http://github.com/:owner/:repo")
getUsers() {
    return {
        owner: "typestack",
        repo: "routing-controllers"
    };
}
```

#### Set custom HTTP code

You can explicitly set a returned HTTP code for any action:

```typescript
@HttpCode(201)
@Post("/users")
saveUser(@Body() user: User) {
    // ...
}
```

#### Controlling empty responses

If your controller returns `void` or `Promise<void>` or `undefined` it will throw you 404 error.
To prevent this if you need to specify what status code you want to return using `@OnUndefined` decorator.

```typescript
@Delete("/users/:id")
@OnUndefined(204)
async remove(@Param("id") id: number): Promise<void> {
    return userRepository.removeById(id);
}
```

`@OnUndefined` is also useful when you return some object which can or cannot be undefined.
In this example `findOneById` returns undefined in the case if user with given id was not found.
This action will return 404 in the case if user was not found, and regular 200 in the case if it was found.

```typescript
@Get("/users/:id")
@OnUndefined(404)
getOne(@Param("id") id: number) {
    return userRepository.findOneById(id);
}
```

You can also specify error class you want to use if it returned undefined:

```typescript
import { HttpError } from 'routing-controllers';

export class UserNotFoundError extends HttpError {
  constructor() {
    super(404, 'User not found!');
  }
}
```

```typescript
@Get("/users/:id")
@OnUndefined(UserNotFoundError)
saveUser(@Param("id") id: number) {
    return userRepository.findOneById(id);
}
```

If controller action returns `null` you can use `@OnNull` decorator instead.

#### Set custom headers

You can set any custom header in a response:

```typescript
@Get("/users/:id")
@Header("Cache-Control", "none")
getOne(@Param("id") id: number) {
    // ...
}
```

#### Render templates

If you are using server-side rendering you can render any template:

```typescript
@Get("/users/:id")
@Render("index.html")
getOne() {
    return {
        param1: "these params are used",
        param2: "in templating engine"
    };
}
```

To use rendering ability make sure to configure express / koa properly.
To use rendering ability with Koa you will need to use a rendering 3rd party such as [koa-views](https://github.com/queckezz/koa-views/),
koa-views is the only render middleware that has been tested.

#### Throw HTTP errors

If you want to return errors with specific error codes, there is an easy way:

```typescript
@Get("/users/:id")
getOne(@Param("id") id: number) {

    const user = this.userRepository.findOneById(id);
    if (!user)
        throw new NotFoundError(`User was not found.`); // message is optional

    return user;
}
```

Now, when user won't be found with requested id, response will be with http status code 404 and following content:

```json
{
  "name": "NotFoundError",
  "message": "User was not found."
}
```

There are set of prepared errors you can use:

- HttpError
- BadRequestError
- ForbiddenError
- InternalServerError
- MethodNotAllowedError
- NotAcceptableError
- NotFoundError
- UnauthorizedError

You can also create and use your own errors by extending `HttpError` class.
To define the data returned to the client, you could define a toJSON method in your error.

```typescript
class DbError extends HttpError {
  public operationName: string;
  public args: any[];

  constructor(operationName: string, args: any[] = []) {
    super(500);
    Object.setPrototypeOf(this, DbError.prototype);
    this.operationName = operationName;
    this.args = args; // can be used for internal logging
  }

  toJSON() {
    return {
      status: this.httpCode,
      failedOperation: this.operationName,
    };
  }
}
```

#### Enable CORS

Since CORS is a feature that is used almost in any web-api application,
you can enable it in routing-controllers options.

```typescript
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';

const app = createExpressServer({
  cors: true,
  controllers: [UserController],
});

app.listen(3000);
```

To use cors you need to install its module.
For express its `npm i cors`, for koa its `npm i kcors`.
You can pass cors options as well:

```typescript
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';

const app = createExpressServer({
  cors: {
    // options from cors documentation
  },
  controllers: [UserController],
});

app.listen(3000);
```

#### Default settings

You can override default status code in routing-controllers options.

```typescript
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';

const app = createExpressServer({
  defaults: {
    //with this option, null will return 404 by default
    nullResultCode: 404,

    //with this option, void or Promise<void> will return 204 by default
    undefinedResultCode: 204,

    paramOptions: {
      //with this option, argument will be required by default
      required: true,
    },
  },
});

app.listen(3000);
```

#### Selectively disable request/response transform

To disable `class-transformer` on a per-controller or per-route basis, use the `transformRequest` and `transformResponse` options on your controller and route decorators:

```typescript
@Controller("/users", {transformRequest: false, transformResponse: false})
export class UserController {

    @Get("/", {transformResponse: true}) {
        // route option overrides controller option
    }
}
```

## Using middlewares

You can use any existing express / koa middleware, or create your own.
To create your middlewares there is a `@Middleware` decorator,
and to use already exist middlewares there are `@UseBefore` and `@UseAfter` decorators.

### Use existing middleware

There are multiple ways to use middleware.
For example, lets try to use [compression](https://github.com/expressjs/compression) middleware:

1. Install compression middleware: `npm install compression`
2. To use middleware per-action:

   ```typescript
   import { Controller, Get, UseBefore } from "routing-controllers";
   let compression = require("compression");

   // ...

   @Get("/users/:id")
   @UseBefore(compression())
   getOne(@Param("id") id: number) {
       // ...
   }
   ```

   This way compression middleware will be applied only for `getOne` controller action,
   and will be executed _before_ action execution.
   To execute middleware _after_ action use `@UseAfter` decorator instead.

3. To use middleware per-controller:

   ```typescript
   import { Controller, UseBefore } from 'routing-controllers';
   let compression = require('compression');

   @Controller()
   @UseBefore(compression())
   export class UserController {}
   ```

   This way compression middleware will be applied for all actions of the `UserController` controller,
   and will be executed _before_ its action execution. Same way you can use `@UseAfter` decorator here.

4. If you want to use compression module globally for all controllers you can simply register it during bootstrap:

   ```typescript
   import { createExpressServer } from 'routing-controllers';
   import { UserController } from './UserController'; // we need to "load" our controller before call createExpressServer. this is required
   let compression = require('compression');
   let app = createExpressServer({
     controllers: [UserController],
   }); // creates express app, registers all controller routes and returns you express app instance
   app.use(compression());
   app.listen(3000); // run express application
   ```

   Alternatively, you can create a custom [global middleware](#global-middlewares) and simply delegate its execution to the compression module.

### Creating your own express middleware

Here is example of creating middleware for express.js:

1. There are two ways of creating middleware:

   First, you can create a simple middleware function:

   ```typescript
   export function loggingMiddleware(request: any, response: any, next?: (err?: any) => any): any {
     console.log('do something...');
     next();
   }
   ```

   Second you can create a class:

   ```typescript
   import { ExpressMiddlewareInterface } from 'routing-controllers';

   export class MyMiddleware implements ExpressMiddlewareInterface {
     // interface implementation is optional

     use(request: any, response: any, next?: (err?: any) => any): any {
       console.log('do something...');
       next();
     }
   }
   ```

2. Then you can use them this way:

   ```typescript
   import { Controller, UseBefore } from 'routing-controllers';
   import { MyMiddleware } from './MyMiddleware';
   import { loggingMiddleware } from './loggingMiddleware';

   @Controller()
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   export class UserController {}
   ```

   or per-action:

   ```typescript
   @Get("/users/:id")
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   getOne(@Param("id") id: number) {
       // ...
   }
   ```

   `@UseBefore` executes middleware before controller action.
   `@UseAfter` executes middleware after each controller action.

### Creating your own koa middleware

Here is example of creating middleware for koa.js:

1. There are two ways of creating middleware:

   First, you can create a simple middleware function:

   ```typescript
   export function use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
     console.log('do something before execution...');
     return next()
       .then(() => {
         console.log('do something after execution');
       })
       .catch(error => {
         console.log('error handling is also here');
       });
   }
   ```

   Second you can create a class:

   ```typescript
   import { KoaMiddlewareInterface } from 'routing-controllers';

   export class MyMiddleware implements KoaMiddlewareInterface {
     // interface implementation is optional

     use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
       console.log('do something before execution...');
       return next()
         .then(() => {
           console.log('do something after execution');
         })
         .catch(error => {
           console.log('error handling is also here');
         });
     }
   }
   ```

2. Then you can them this way:

   ```typescript
   import { Controller, UseBefore } from 'routing-controllers';
   import { MyMiddleware } from './MyMiddleware';
   import { loggingMiddleware } from './loggingMiddleware';

   @Controller()
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   export class UserController {}
   ```

   or per-action:

   ```typescript
   @Get("/users/:id")
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   getOne(@Param("id") id: number) {
       // ...
   }
   ```

   `@UseBefore` executes middleware before controller action.
   `@UseAfter` executes middleware after each controller action.

### Global middlewares

Global middlewares run before each request, always.
To make your middleware global mark it with `@Middleware` decorator and specify if it runs after or before controllers actions.

```typescript
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'before' })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err: any) => any): void {
    console.log('do something...');
    next();
  }
}
```

To enable this middleware, specify it during routing-controllers initialization:

```typescript
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';
import { LoggingMiddleware } from './LoggingMiddleware';

createExpressServer({
  controllers: [UserController],
  middlewares: [LoggingMiddleware],
}).listen(3000);
```

### Error handlers

Error handlers are specific only to express.
Error handlers work same way as middlewares, but implement `ExpressErrorMiddlewareInterface`:

1. Create a class that implements the `ErrorMiddlewareInterface` interface:

   ```typescript
   import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

   @Middleware({ type: 'after' })
   export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
     error(error: any, request: any, response: any, next: (err: any) => any) {
       console.log('do something...');
       next();
     }
   }
   ```

Custom error handlers are invoked after the default error handler, so you won't be able to change response code or headers.
To prevent this, you have to disable default error handler by specifying `defaultErrorHandler` option in createExpressServer or useExpressServer:

```typescript
createExpressServer({
  defaultErrorHandler: false, // disable default error handler, only if you have your own error handler
}).listen(3000);
```

### Loading middlewares, interceptors and controllers from directories

Also you can load middlewares from directories. Also you can use glob patterns:

```typescript
import { createExpressServer } from 'routing-controllers';
createExpressServer({
  controllers: [__dirname + '/controllers/**/*.js'],
  middlewares: [__dirname + '/middlewares/**/*.js'],
  interceptors: [__dirname + '/interceptors/**/*.js'],
}).listen(3000);
```

## Using interceptors

Interceptors are used to change or replace the data returned to the client.
You can create your own interceptor class or function and use to all or specific controller or controller action.
It works pretty much the same as middlewares.

### Interceptor function

The easiest way is to use functions directly passed to `@UseInterceptor` of the action.

```typescript
import { Get, Param, UseInterceptor } from "routing-controllers";

// ...

@Get("/users")
@UseInterceptor(function(action: Action, content: any) {
    // here you have content returned by this action. you can replace something
    // in it and return a replaced result. replaced result will be returned to the user
    return content.replace(/Mike/gi, "Michael");
})
getOne(@Param("id") id: number) {
    return "Hello, I am Mike!"; // client will get a "Hello, I am Michael!" response.
}
```

You can use `@UseInterceptor` per-action, or per-controller.
If its used per-controller then interceptor will apply to all controller actions.

### Interceptor classes

You can also create a class and use it with `@UseInterceptor` decorator:

```typescript
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

export class NameCorrectionInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    return content.replace(/Mike/gi, 'Michael');
  }
}
```

And use it in your controllers this way:

```typescript
import { Get, Param, UseInterceptor } from "routing-controllers";
import { NameCorrectionInterceptor } from "./NameCorrectionInterceptor";

// ...

@Get("/users")
@UseInterceptor(NameCorrectionInterceptor)
getOne(@Param("id") id: number) {
    return "Hello, I am Mike!"; // client will get a "Hello, I am Michael!" response.
}
```

### Global interceptors

You can create interceptors that will affect all controllers in your project by creating interceptor class
and mark it with `@Interceptor` decorator:

```typescript
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

@Interceptor()
export class NameCorrectionInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    return content.replace(/Mike/gi, 'Michael');
  }
}
```

## Creating instances of classes from action params

When user sends a json object and you are parsing it, sometimes you want to parse it into object of some class, instead of parsing it into simple literal object.
You have ability to do this using [class-transformer][4].
To use it simply specify a `classTransformer: true` option on application bootstrap:

```typescript
import { createExpressServer } from 'routing-controllers';

createExpressServer({
  classTransformer: true,
}).listen(3000);
```

Now, when you parse your action params, if you have specified a class, routing-controllers will create you a class
of that instance with the data sent by a user:

```typescript
export class User {
  firstName: string;
  lastName: string;

  getName(): string {
    return this.lastName + ' ' + this.firstName;
  }
}

@Controller()
export class UserController {
  post(@Body() user: User) {
    console.log('saving user ' + user.getName());
  }
}
```

If `User` is an interface - then simple literal object will be created.
If its a class - then instance of this class will be created.

This technique works with `@Body`, `@Param`, `@QueryParam`, `@BodyParam`, and other decorators.
Learn more about class-transformer and how to handle more complex object constructions [here][4].
This behaviour is enabled by default.
If you want to disable it simply pass `classTransformer: false` to createExpressServer method. Alternatively you can disable transforming for [individual controllers or routes](#selectively-disable-requestresponse-transforming).

## Controller Inheritance

Often your application may need to have an option to inherit controller from another to reuse code and void duplication.
A good example of the use is the CRUD operations which can be hidden inside `AbstractBaseController` with the possibility to add new and overload methods, the template method pattern.

```typescript
@Controller(`/product`)
class ProductController extends AbstractControllerTemplate {}
@Controller(`/category`)
class CategoryController extends AbstractControllerTemplate {}
abstract class AbstractControllerTemplate {
  @Post()
  public create() {}

  @Read()
  public read() {}

  @Put()
  public update() {}

  @Delete()
  public delete() {}
}
```

https://en.wikipedia.org/wiki/Template_method_pattern

## Auto validating action params

Sometimes parsing a json object into instance of some class is not enough.
E.g. `class-transformer` doesn't check whether the property's types are correct, so you can get runtime error if you rely on TypeScript type safe. Also you may want to validate the object to check e.g. whether the password string is long enough or entered e-mail is correct.

It can be done easily thanks to integration with [class-validator][9]. This behaviour is **enabled** by default. If you want to disable it, you need to do it explicitly e.g. by passing `validation: false` option on application bootstrap:

```typescript
import { createExpressServer } from 'routing-controllers';

createExpressServer({
  validation: false,
}).listen(3000);
```

If you want to turn on the validation only for some params, not globally for every parameter, you can do this locally by setting `validate: true` option in parameter decorator options object:

```typescript
@Post("/login")
login(@Body({ validate: true }) user: User) {}
```

Now you need to define the class which type will be used as type of controller's method param.
Decorate the properties with appropriate validation decorators.

```typescript
export class User {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

If you haven't used class-validator yet, you can learn how to use the decorators and handle more complex object validation [here][9].

Now, if you have specified a class type, your action params will be not only an instance of that class (with the data sent by a user) but they will be validated too, so you don't have to worry about eg. incorrect e-mail or too short password and manual checks every property in controller method body.

```typescript
@Controller()
export class UserController {
  @Post('/login')
  login(@Body() user: User) {
    console.log(`${user.email} is for 100% sure a valid e-mail address!`);
    console.log(`${user.password.length} is for 100% sure 6 chars or more!`);
  }
}
```

If the param doesn't satisfy the requirements defined by class-validator decorators,
an error will be thrown and captured by routing-controller, so the client will receive 400 Bad Request and JSON with nice detailed [Validation errors](https://github.com/typestack/class-validator#validation-errors) array.

If you need special options for validation (groups, skipping missing properties, etc.) or transforming (groups, excluding prefixes, versions, etc.), you can pass them as global config as `validation` in createExpressServer method or as a local `validate` setting for method parameter - `@Body({ validate: localOptions })`.

This technique works not only with `@Body` but also with `@Param`, `@QueryParam`, `@BodyParam` and other decorators.

## Using authorization features

Routing-controllers comes with two decorators helping you to organize authorization in your application.

#### `@Authorized` decorator

To make `@Authorized` decorator to work you need to setup special routing-controllers options:

```typescript
import { createExpressServer, Action } from 'routing-controllers';

createExpressServer({
  authorizationChecker: async (action: Action, roles: string[]) => {
    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    // demo code:
    const token = action.request.headers['authorization'];

    const user = await getEntityManager().findOneByToken(User, token);
    if (user && !roles.length) return true;
    if (user && roles.find(role => user.roles.indexOf(role) !== -1)) return true;

    return false;
  },
}).listen(3000);
```

You can use `@Authorized` on controller actions:

```typescript
@JsonController()
export class SomeController {
  @Authorized()
  @Post('/questions')
  save(@Body() question: Question) {}

  @Authorized('POST_MODERATOR') // you can specify roles or array of roles
  @Post('/posts')
  save(@Body() post: Post) {}
}
```

#### `@CurrentUser` decorator

To make `@CurrentUser` decorator to work you need to setup special routing-controllers options:

```typescript
import { createExpressServer, Action } from 'routing-controllers';

createExpressServer({
  currentUserChecker: async (action: Action) => {
    // here you can use request/response objects from action
    // you need to provide a user object that will be injected in controller actions
    // demo code:
    const token = action.request.headers['authorization'];
    return getEntityManager().findOneByToken(User, token);
  },
}).listen(3000);
```

You can use `@CurrentUser` on controller actions:

```typescript
@JsonController()
export class QuestionController {
  @Get('/questions')
  all(@CurrentUser() user?: User, @Body() question: Question) {}

  @Post('/questions')
  save(@CurrentUser({ required: true }) user: User, @Body() post: Post) {}
}
```

If you mark `@CurrentUser` as `required` and currentUserChecker logic will return empty result,
then routing-controllers will throw authorization required error.

## Using DI container

`routing-controllers` supports a DI container out of the box. You can inject your services into your controllers,
middlewares and error handlers. Container must be setup during application bootstrap.
Here is example how to integrate routing-controllers with [typedi](https://github.com/typestack/typedi):

```typescript
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

// its important to set container before any operation you do with routing-controllers,
// including importing controllers
useContainer(Container);

// create and run server
createExpressServer({
  controllers: [__dirname + '/controllers/*.js'],
  middlewares: [__dirname + '/middlewares/*.js'],
  interceptors: [__dirname + '/interceptors/*.js'],
}).listen(3000);
```

That's it, now you can inject your services into your controllers:

```typescript
@Controller()
@Service()
export class UsersController {
  constructor(private userRepository: UserRepository) {}

  // ... controller actions
}
```

Note: As TypeDI@0.9.0 won't create instances for unknown classes, you have to decorate your Controller as a `Service()` as well. See [#642](https://github.com/typestack/routing-controllers/issues/642)

For other IoC providers that don't expose a `get(xxx)` function, you can create an IoC adapter using `IocAdapter` like so:

```typescript
// inversify-adapter.ts
import { IocAdapter } from 'routing-controllers';
import { Container } from 'inversify';

class InversifyAdapter implements IocAdapter {
  constructor(private readonly container: Container) {}

  get<T>(someClass: ClassConstructor<T>, action?: Action): T {
    const childContainer = this.container.createChild();
    childContainer.bind(API_SYMBOLS.ClientIp).toConstantValue(action.context.ip);
    return childContainer.resolve<T>(someClass);
  }
}
```

And then tell Routing Controllers to use it:

```typescript
// Somewhere in your app startup
import { useContainer } from 'routing-controllers';
import { Container } from 'inversify';
import { InversifyAdapter } from './inversify-adapter.ts';

const container = new Container();
const inversifyAdapter = new InversifyAdapter(container);
useContainer(inversifyAdapter);
```

## Custom parameter decorators

You can create your own parameter decorators.
Here is simple example how "session user" can be implemented using custom decorators:

```typescript
import { createParamDecorator } from 'routing-controllers';

export function UserFromSession(options?: { required?: boolean }) {
  return createParamDecorator({
    required: options && options.required ? true : false,
    value: action => {
      const token = action.request.headers['authorization'];
      return database.findUserByToken(token);
    },
  });
}
```

And use it in your controller:

```typescript
@JsonController()
export class QuestionController {
  @Post()
  save(@Body() question: Question, @UserFromSession({ required: true }) user: User) {
    // here you'll have user authorized and you can safely save your question
    // in the case if user returned your undefined from the database and "required"
    // parameter was set, routing-controllers will throw you ParameterRequired error
  }
}
```

## Decorators Reference

#### Controller Decorators

| Signature                            | Example                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@Controller(baseRoute: string)`     | `@Controller("/users") class SomeController`         | Class that is marked with this decorator is registered as controller and its annotated methods are registered as actions. Base route is used to concatenate it to all controller action routes.                                                                                                                                                                                                                                                     |
| `@JsonController(baseRoute: string)` | `@JsonController("/users") class SomeJsonController` | Class that is marked with this decorator is registered as controller and its annotated methods are registered as actions. Difference between @JsonController and @Controller is that @JsonController automatically converts results returned by controller to json objects (using JSON.parse) and response being sent to a client is sent with application/json content-type. Base route is used to concatenate it to all controller action routes. |

#### Controller Action Decorators

| Signature                                            | Example                                | Description                                                                                                                                                                                                      | express.js analogue                |
| ---------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `@Get(route: string\|RegExp)`                        | `@Get("/users") all()`                 | Methods marked with this decorator will register a request made with GET HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                | `app.get("/users", all)`           |
| `@Post(route: string\|RegExp)`                       | `@Post("/users") save()`               | Methods marked with this decorator will register a request made with POST HTTP Method to a given route. In action options you can specify if action should response json or regular text response.               | `app.post("/users", save)`         |
| `@Put(route: string\|RegExp)`                        | `@Put("/users/:id") update()`          | Methods marked with this decorator will register a request made with PUT HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                | `app.put("/users/:id", update)`    |
| `@Patch(route: string\|RegExp)`                      | `@Patch("/users/:id") patch()`         | Methods marked with this decorator will register a request made with PATCH HTTP Method to a given route. In action options you can specify if action should response json or regular text response.              | `app.patch("/users/:id", patch)`   |
| `@Delete(route: string\|RegExp)`                     | `@Delete("/users/:id") delete()`       | Methods marked with this decorator will register a request made with DELETE HTTP Method to a given route. In action options you can specify if action should response json or regular text response.             | `app.delete("/users/:id", delete)` |
| `@Head(route: string\|RegExp)`                       | `@Head("/users/:id") head()`           | Methods marked with this decorator will register a request made with HEAD HTTP Method to a given route. In action options you can specify if action should response json or regular text response.               | `app.head("/users/:id", head)`     |
| `@All(route: string\|RegExp)`                        | `@All("/users/me") rewrite()`          | Methods marked with this decorator will register a request made with any HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                | `app.all("/users/me", rewrite)`    |
| `@Method(methodName: string, route: string\|RegExp)` | `@Method("move", "/users/:id") move()` | Methods marked with this decorator will register a request made with given `methodName` HTTP Method to a given route. In action options you can specify if action should response json or regular text response. | `app.move("/users/:id", move)`     |

#### Method Parameter Decorators

| Signature                                               | Example                                          | Description                                                                                                                | express.js analogue                |
| ------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `@Req()`                                                | `getAll(@Req() request: Request)`                | Injects a Request object.                                                                                                  | `function (request, response)`     |
| `@Res()`                                                | `getAll(@Res() response: Response)`              | Injects a Response object.                                                                                                 | `function (request, response)`     |
| `@Ctx()`                                                | `getAll(@Ctx() context: Context)`                | Injects a Context object (koa-specific)                                                                                    | `function (ctx)` (koa-analogue)    |
| `@Param(name: string, options?: ParamOptions)`          | `get(@Param("id") id: number)`                   | Injects a router parameter.                                                                                                | `request.params.id`                |
| `@Params()`                                             | `get(@Params() params: any)`                     | Injects all router parameters.                                                                                             | `request.params`                   |
| `@QueryParam(name: string, options?: ParamOptions)`     | `get(@QueryParam("id") id: number)`              | Injects a query string parameter.                                                                                          | `request.query.id`                 |
| `@QueryParams()`                                        | `get(@QueryParams() params: any)`                | Injects all query parameters.                                                                                              | `request.query`                    |
| `@HeaderParam(name: string, options?: ParamOptions)`    | `get(@HeaderParam("token") token: string)`       | Injects a specific request headers.                                                                                        | `request.headers.token`            |
| `@HeaderParams()`                                       | `get(@HeaderParams() params: any)`               | Injects all request headers.                                                                                               | `request.headers`                  |
| `@CookieParam(name: string, options?: ParamOptions)`    | `get(@CookieParam("username") username: string)` | Injects a cookie parameter.                                                                                                | `request.cookie("username")`       |
| `@CookieParams()`                                       | `get(@CookieParams() params: any)`               | Injects all cookies.                                                                                                       | `request.cookies`                  |
| `@Session()`                                            | `get(@Session() session: any)`                   | Injects the whole session object.                                                                                          | `request.session`                  |
| `@SessionParam(name: string)`                           | `get(@SessionParam("user") user: User)`          | Injects an object from session property.                                                                                   | `request.session.user`             |
| `@State(name?: string)`                                 | `get(@State() session: StateType)`               | Injects an object from the state (or the whole state).                                                                     | `ctx.state` (koa-analogue)         |
| `@Body(options?: BodyOptions)`                          | `post(@Body() body: any)`                        | Injects a body. In parameter options you can specify body parser middleware options.                                       | `request.body`                     |
| `@BodyParam(name: string, options?: ParamOptions)`      | `post(@BodyParam("name") name: string)`          | Injects a body parameter.                                                                                                  | `request.body.name`                |
| `@UploadedFile(name: string, options?: UploadOptions)`  | `post(@UploadedFile("filename") file: any)`      | Injects uploaded file from the response. In parameter options you can specify underlying uploader middleware options.      | `request.file.file` (using multer) |
| `@UploadedFiles(name: string, options?: UploadOptions)` | `post(@UploadedFiles("filename") files: any[])`  | Injects all uploaded files from the response. In parameter options you can specify underlying uploader middleware options. | `request.files` (using multer)     |

#### Middleware and Interceptor Decorators

| Signature                                  | Example                                                | Description                                                                      |
| ------------------------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `@Middleware({ type: "before"\|"after" })` | `@Middleware({ type: "before" }) class SomeMiddleware` | Registers a global middleware.                                                   |
| `@UseBefore()`                             | `@UseBefore(CompressionMiddleware)`                    | Uses given middleware before action is being executed.                           |
| `@UseAfter()`                              | `@UseAfter(CompressionMiddleware)`                     | Uses given middleware after action is being executed.                            |
| `@Interceptor()`                           | `@Interceptor() class SomeInterceptor`                 | Registers a global interceptor.                                                  |
| `@UseInterceptor()`                        | `@UseInterceptor(BadWordsInterceptor)`                 | Intercepts result of the given controller/action and replaces some values of it. |

#### Other Decorators

| Signature                                                        | Example                                           | Description                                                                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `@Authorized(roles?: string\|string[])`                          | `@Authorized("SUPER_ADMIN")` get()                | Checks if user is authorized and has given roles on a given route. `authorizationChecker` should be defined in routing-controllers options. |  |
| `@CurrentUser(options?: { required?: boolean })`                 | get(@CurrentUser({ required: true }) user: User)  | Injects currently authorized user. `currentUserChecker` should be defined in routing-controllers options.                                   |
| `@Header(headerName: string, headerValue: string)`               | `@Header("Cache-Control", "private")` get()       | Allows to explicitly set any HTTP header returned in the response.                                                                          |
| `@ContentType(contentType: string)`                              | `@ContentType("text/csv")` get()                  | Allows to explicitly set HTTP Content-Type returned in the response.                                                                        |
| `@Location(url: string)`                                         | `@Location("http://github.com")` get()            | Allows to explicitly set HTTP Location header returned in the response.                                                                     |
| `@Redirect(url: string)`                                         | `@Redirect("http://github.com")` get()            | Allows to explicitly set HTTP Redirect header returned in the response.                                                                     |
| `@HttpCode(code: number)`                                        | `@HttpCode(201)` post()                           | Allows to explicitly set HTTP code to be returned in the response.                                                                          |
| `@OnNull(codeOrError: number\|Error)`                            | `@OnNull(201)` post()                             | Sets a given HTTP code when controller action returned null.                                                                                |
| `@OnUndefined(codeOrError: number\|Error)`                       | `@OnUndefined(201)` post()                        | Sets a given HTTP code when controller action returned undefined.                                                                           |
| `@ResponseClassTransformOptions(options: ClassTransformOptions)` | `@ResponseClassTransformOptions({/*...*/})` get() | Sets options to be passed to class-transformer when it used for classToPlain a response result.                                             |
| `@Render(template: string)`                                      | `@Render("user-list.html")` get()                 | Renders a given html template. Data returned by a controller serve as template variables.                                                   |

## Samples

- Take a look on [routing-controllers with express](https://github.com/typestack/routing-controllers-express-demo) which is using routing-controllers.
- Take a look on [routing-controllers with koa](https://github.com/typestack/routing-controllers-koa-demo) which is using routing-controllers.
- Take a look on [routing-controllers with angular 2](https://github.com/typestack/routing-controllers-angular2-demo) which is using routing-controllers.
- Take a look on [node-microservice-demo](https://github.com/swimlane/node-microservice-demo) which is using routing-controllers.
- Take a look on samples in [./sample](https://github.com/typestack/routing-controllers/tree/master/sample) for more examples
  of usage.

## Release notes

See information about breaking changes and release notes [here](CHANGELOG.md).

[1]: http://expressjs.com/
[2]: http://koajs.com/
[3]: https://github.com/expressjs/multer
[4]: https://github.com/typestack/class-transformer
[5]: https://www.npmjs.com/package/express-session
[6]: https://www.npmjs.com/package/koa-session
[7]: https://www.npmjs.com/package/koa-generic-session
[8]: http://koajs.com/#ctx-state
[9]: https://github.com/typestack/class-validator

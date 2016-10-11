# routing-controllers

[![Build Status](https://travis-ci.org/pleerock/routing-controllers.svg?branch=master)](https://travis-ci.org/pleerock/routing-controllers)
[![codecov](https://codecov.io/gh/pleerock/routing-controllers/branch/master/graph/badge.svg)](https://codecov.io/gh/pleerock/routing-controllers)
[![npm version](https://badge.fury.io/js/routing-controllers.svg)](https://badge.fury.io/js/routing-controllers)
[![Dependency Status](https://david-dm.org/pleerock/routing-controllers.svg)](https://david-dm.org/pleerock/routing-controllers)
[![devDependency Status](https://david-dm.org/pleerock/routing-controllers/dev-status.svg)](https://david-dm.org/pleerock/routing-controllers#info=devDependencies)
[![Join the chat at https://gitter.im/pleerock/routing-controllers](https://badges.gitter.im/pleerock/routing-controllers.svg)](https://gitter.im/pleerock/routing-controllers?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Allows to create controller classes with methods as actions that handle requests.
You can use routing-controllers with [express.js][1] or [koa.js][2].

# Table of Contents

  * [Installation](#installation)
  * [Example of usage](#example-of-usage)
  * [More usage examples](#more-usage-examples)
      - [Return promises](#return-promises)
      - [Using Request and Response objects](#using-request-and-response-objects)
      - [Using exist server instead of creating a new one](#using-exist-server-instead-of-creating-a-new-one)
      - [Load all controllers from the given directory](#load-all-controllers-from-the-given-directory)
      - [Load all controllers from the given directory and prefix routes](#load-all-controllers-from-the-given-directory-and-prefix-routes)
      - [Prefix controller with base route](#prefix-controller-with-base-route)
      - [Using JSON instead of regular text content](#using-json-instead-of-regular-text-content)
      - [Per-action JSON / non-JSON output](#per-action-json--non-json-output)
      - [Inject routing parameters](#inject-routing-parameters)
      - [Inject query parameters](#inject-query-parameters)
      - [Inject request body](#inject-request-body)
      - [Inject request body parameters](#inject-request-body-parameters)
      - [Inject request header parameters](#inject-request-header-parameters)
      - [Inject session object](#inject-session-object)
      - [Inject uploaded file](#inject-uploaded-file)
      - [Inject uploaded files](#inject-uploaded-files)
      - [Inject cookie parameter](#inject-cookie-parameter)
      - [Make parameter required](#make-parameter-required)
      - [Convert parameters to objects](#convert-parameters-to-objects)
      - [Set custom ContentType](#set-custom-contenttype)
      - [Set Location](#set-location)
      - [Set Redirect](#set-redirect)
      - [Set custom HTTP code](#set-custom-http-code)
      - [Set custom headers](#set-custom-headers)
      - [Render templates](#render-templates)
  * [Using middlewares](#using-middlewares)
    + [Use exist middleware](#use-exist-middleware)
    + [Creating your own express middleware](#creating-your-own-express-middleware)
    + [Creating your own koa middleware](#creating-your-own-koa-middleware)
    + [Global middlewares](#global-middlewares)
    + [Error handlers](#error-handlers)
  * [Using interceptors](#using-interceptors)
    + [Interceptor function](#interceptor-function)
    + [Interceptor classes](#interceptor-classes)
    + [Global interceptors](#global-interceptors)
    + [Don't forget to load your middlewares, error handlers and interceptors](#dont-forget-to-load-your-middlewares-error-handlers-and-interceptors)
  * [Creating instances of classes from action params](#creating-instances-of-classes-from-action-params)
  * [Default error handling](#default-error-handling)
  * [Using DI container](#using-di-container)
  * [Decorators Reference](#decorators-reference)
      - [Controller Decorators](#controller-decorators)
      - [Controller Method Decorators](#controller-method-decorators)
      - [Method Parameter Decorators](#method-parameter-decorators)
      - [Middleware and Interceptor Decorators](#middleware-and-interceptor-decorators)
      - [Other Decorators](#other-decorators)
  * [Samples](#samples)
  * [Release notes](#release-notes)

## Installation

1. Install module:

    `npm install routing-controllers --save`

2. `reflect-metadata` shim is required:

    `npm install reflect-metadata --save`

    and make sure to import it in a global place, like app.ts:

    ```typescript
    import "reflect-metadata";
    ```

3. ES6 features are used, if you are using old version of node.js you may need to install
 [es6-shim](https://github.com/paulmillr/es6-shim):

    `npm install es6-shim --save`

    and import it in a global place like app.ts:

    ```typescript
    import "es6-shim";
    ```

4. Install framework:

    **a. If you want to use routing-controllers with *express.js*, then install it and all required dependencies:**

    `npm install express body-parser multer --save`

    Optionally you can also install its [typings](https://github.com/typings/typings):

    `typings install dt~express dt~serve-static --save --global`

    **b. If you want to use routing-controllers with *koa 2*, then install it and all required dependencies:**

    `npm install koa@next koa-router@next koa-bodyparser@next --save`

    Optionally you can also install its [typings](https://github.com/typings/typings):

    `typings install dt~koa --save --global`
    
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
    import {Controller, Param, Body, Get, Post, Put, Delete} from "routing-controllers";

    @Controller()
    export class UserController {

        @Get("/users")
        getAll() {
           return "This action returns all users";
        }

        @Get("/users/:id")
        getOne(@Param("id") id: number) {
           return "This action returns user #" + id;
        }

        @Post("/users")
        post(@Body() user: any) {
           return "Saving user...";
        }

        @Put("/users/:id")
        put(@Param("id") id: number, @Body() user: any) {
           return "Updating a user...";
        }

        @Delete("/users/:id")
        remove(@Param("id") id: number) {
           return "Removing user...";
        }

    }
    ```

    This class will register routes specified in method decorators in your server framework (express.js or koa).

2. Create a file `app.ts`

    ```typescript
    import "es6-shim"; // this shim is optional if you are using old version of node
    import "reflect-metadata"; // this shim is required
    import {createExpressServer} from "routing-controllers";
    import "./UserController";  // we need to "load" our controller before call createServer. this is required
    let app = createExpressServer(); // creates express app, registers all controller routes and returns you express app instance
    app.listen(3000); // run express application
    ```

    > koa users just need to call `createKoaServer` instead of `createExpressServer`

3. Open in browser `http://localhost:3000/users`. You should see `This action returns all users` in your browser.
If you open `http://localhost:3000/users/1` you should see `This action returns user #1` in your browser.

## More usage examples

#### Return promises

You can return a promise in the controller, and it will wait until promise resolved and return in a response a promise result.

```typescript
import {JsonController, Param, Body, Get, Post, Put, Delete} from "routing-controllers";

@JsonController()
export class UserController {

    @Get("/users")
    getAll() {
       return userRepository.findAll();
    }

    @Get("/users/:id")
    getOne(@Param("id") id: number) {
       return userRepository.findById(id);
    }

    @Post("/users")
    post(@Body() user: User) {
       return userRepository.insert(user);
    }

    @Put("/users/:id")
    put(@Param("id") id: number, @Body() user: User) {
       return userRepository.updateById(id, user);
    }

    @Delete("/users/:id")
    remove(@Param("id") id: number) {
       return userRepository.removeById(id);
    }

}
```

#### Using Request and Response objects

You can use framework's request and response objects this way:

```typescript
import {Controller, Req, Res, Get} from "routing-controllers";

@Controller()
export class UserController {

    @Get("/users")
    getAll(@Req() request: any, @Res() response: any) {
        response.send("Hello response!");
    }

}
```

`@Req()` decorator inject you a `Request` object, and `@Res()` decorator inject you a `Response` object.
If you have installed a express typings too, you can use their types:

```typescript
import {Request, Response} from "express";
import {Controller, Req, Res, Get} from "routing-controllers";

@Controller()
export class UserController {

    @Get("/users")
    getAll(@Req() request: Request, @Res() response: Response) {
        response.send("Hello response!");
    }

}
```

#### Using exist server instead of creating a new one

If you have, or if you want to create and configure express app separately,
you can use `useExpressServer` instead of `createExpressServer` function:

```typescript
import "reflect-metadata"; // this shim is required
import {useExpressServer} from "routing-controllers";

let express = require("express"); // or you can import it if you have installed typings
let app = express(); // your created express server
// app.use() // maybe you configure it the way you want
useExpressServer(app); // register created express server in routing-controllers
app.listen(3000); // run your express server
```

> koa users must use `useKoaServer` instead of `useExpressServer`

#### Load all controllers from the given directory

You can load all controllers in once from specific directories, by specifying array of directories via options in
`createExpressServer` or `useExpressServer`:

```typescript
import "reflect-metadata"; // this shim is required
import {createExpressServer, loadControllers} from "routing-controllers";

createExpressServer({
    controllers: [__dirname + "/controllers/*.js"]
}).listen(3000); // register controllers routes in our express application
```

> koa users must use `createKoaServer` instead of `createExpressServer`

#### Load all controllers from the given directory and prefix routes

If you want to prefix all routes in some directory eg. /api 

```typescript
import "reflect-metadata"; // this shim is required
import {createExpressServer} from "routing-controllers";

createExpressServer({
    routePrefix: "/api",
    controllers: [__dirname + "/api/controllers/*.js"] // register controllers routes in our express app
}).listen(3000);
```

> koa users must use `createKoaServer` instead of `createExpressServer`

#### Prefix controller with base route

You can prefix all controller's actions with specific base route:

```typescript
@Controller("/users")
export class UserController {
    // ...
}
```

#### Using JSON instead of regular text content

If you are designing a REST API where your endpoints always receive and return JSON you can use `@JsonController` decorator instead
of `@Controller`. This will guarantee you that data returned by your controller actions always be transformed to JSON
 and `Content-Type` header will be always set to `application/json`. It will also guarantee that the `application/json` header is understood from the requests and the body parsed as JSON:

```typescript
@JsonController()
export class UserController {
    // ...
}
```

#### Per-action JSON / non-JSON output

In the case if you want to control if your controller's action will return json or regular plain text,
you can specify a special option:

```typescript
// this will ignore @Controller if it used and return a json in a response
@Get("/users")
@JsonResponse()
getUsers() {
}

// this will ignore @JsonController if it used and return a regular text in a response
@Get("/posts")
@TextResponse()
getPosts() {
}
```

#### Inject routing parameters

You can use parameters in your routes, and to inject such parameters in your controller methods use `@Param` decorator:

```typescript
@Get("/users/:id")
getUsers(@Param("id") id: number) {
}
```

#### Inject query parameters

To inject query parameters, use `@QueryParam` decorator:

```typescript
@Get("/users")
getUsers(@QueryParam("limit") limit: number) {
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
routing-controllers will use [class-transformer][4] to create instance of the given class type with the data received in request body.
To disable this behaviour you need to specify a `{ useConstructorUtils: false }` in RoutingControllerOptions when creating a server.


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

#### Inject session object

To inject a whole session object, use `@Session` decorator:

```typescript
@Post("/login/")
loginUser(@Session() session: Express.Session, @Body() user: User) {
}
```

To inject a single object from session, use `@Session` decorator with parameter:

```typescript
@Get("/login/")
savePost(@Session("user") user: User, @Body() post: Post) {
}
```

Routing-controllers uses [express-session][5] to handle session, so firstly you have to install it manually to use `@Session` decorator.
This feature is not supported by koa driver yet.

#### Inject uploaded file

To inject uploaded file, use `@UploadedFile` decorator:

```typescript
@Post("/files")
saveFile(@UploadedFile("fileName") file: any) {
}
```

Routing-controllers uses [multer][3] to handle file uploads.
You can install multer's file definitions via typings, and use `files: File[]` type instead of `any[]`.
This feature is not supported by koa driver yet.

#### Inject uploaded files

To inject all uploaded files, use `@UploadedFiles` decorator:

```typescript
@Post("/files")
saveAll(@UploadedFiles("files") files: any[]) {
}
```

Routing-controllers uses [multer][3] to handle file uploads.
You can install multer's file definitions via typings, and use `files: File[]` type instead of `any[]`.
This feature is not supported by koa driver yet.

#### Inject cookie parameter

To get a cookie parameter, use `@CookieParam` decorator:

```typescript
@Get("/users")
getUsers(@CookieParam("username") username: string) {
}
```

#### Make parameter required

To make any parameter required, simply pass a `required: true` flag in its options:

```typescript
@Post("/users")
save(@Body({ required: true }) user: any) {
    // your method will not be executed if user is not sent in a request
}
```

Same you can do with all other parameters: @Param, @QueryParam, @BodyParam and others.

#### Convert parameters to objects

If you specify a class type to parameter that is decorated with parameter decorator,
routing-controllers will use [class-transformer][4] to create instance of that class type.
To disable this behaviour you need to specify a `{ useConstructorUtils: false }` in RoutingControllerOptions when creating a server.

```typescript
@Get("/users")
getUsers(@QueryParam("filter") filter: UserFilter) {
    // now you can use your filter, for example
    if (filter.showAll === true)
        return "all users";

    return "not all users";
}

// you can send a request to http://localhost:3000/users?filter={"showAll": true}
// and it will show you "all users"
```

If `UserFilter` is an interface - then simple literal object will be created.
If its a class - then instance of this will be created.

#### Set custom ContentType

You can specify a custom ContentType:

```typescript
@Get("/users")
@ContentType("text/cvs")
getUsers() {
    // ...
}
```
#### Set Location

You can set a location for any action:

```typescript
@Get("/users")
@Location("http://github.com")
getUsers() {
    // ...
}
```

#### Set Redirect

You can set a redirect for any action:

```typescript
@Get("/users")
@Redirect("http://github.com")
getUsers() {
    // ...
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

Also, there are several additional decorators, that sets conditional http code:

```typescript
@Get("/users/:id")
@EmptyResultCode(404)
saveUser(@Param("id") id: number) {
    return userRepository.findOneById(id);
}
```

In this example `findOneById` returns undefined in the case if user with given was not found.
This action will return 404 in the case if user was not found, and regular 200 in the case if it was found.
`@EmptyResultCode` allows to set any HTTP code in the case if controller's action returned empty result (null or undefined).
There are also `@NullResultCode` and `@UndefindeResultCode()` in the case if you want to return specific codes only
if controller's action returned null or undefined respectively.

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

You can set any custom header in a response:

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

To use rendering ability make sure to configure express properly.
[Here](https://github.com/pleerock/routing-controllers/blob/0.6.0-release/test/functional/render-decorator.spec.ts)
is a test where you can take a look how to do it.
This feature is not supported by koa driver yet.

## Using middlewares

You can use any exist express / koa middleware, or create your own.
To create your middlewares there is a `@Middleware` decorator,
and to use already exist middlewares there are `@UseBefore` and `@UseAfter` decorators.

### Use exist middleware

There are multiple ways to use middlewares.
For example, lets try to use [compression](https://github.com/expressjs/compression) middleware:

1. Install compression middleware: `npm install compression`
2. To use middleware per-action:

    ```typescript
    import {Controller, Get, UseBefore} from "routing-controllers";
    let compression = require("compression");

    // ...

    @Get("/users/:id")
    @UseBefore(compression())
    getOne(@Param("id") id: number) {
        // ...
    }
    ```

    This way compression middleware will be applied only for `getOne` controller action,
    and will be executed *before* action execution.
    To execute middleware *after* action use `@UseAfter` decorator instead.

3. To use middleware per-controller:

    ```typescript
    import {Controller, UseBefore} from "routing-controllers";
    let compression = require("compression");

    @Controller()
    @UseBefore(compression())
    export class UserController {

    }
    ```

    This way compression middleware will be applied for all actions of the `UserController` controller,
    and will be executed *before* its action execution. Same way you can use `@UseAfter` decorator here.

4. If you want to use compression module globally for all controllers you can simply register it during bootstrap:

    ```typescript
    import "reflect-metadata";
    import {createExpressServer} from "routing-controllers";
    import "./UserController";  // we need to "load" our controller before call createExpressServer. this is required
    let compression = require("compression");
    let app = createExpressServer(); // creates express app, registers all controller routes and returns you express app instance
    app.use(compression());
    app.listen(3000); // run express application
    ```

    Alternatively, you can create a custom [global middleware](#global-middlewares) and simply delegate its execution to the compression module.

### Creating your own express middleware

Here is example of creating middleware for express.js:

1. To create your own middleware you need to create a class that implements a `MiddlewareInterface` interface and decorated
with `@Middleware` decorator:

    ```typescript
    import {Middleware, MiddlewareInterface} from "routing-controllers";

    @Middleware()
    export class MyMiddleware implements MiddlewareInterface {

        use(request: any, response: any, next?: (err?: any) => any): any {
            console.log("do something...");
            next();
        }

    }
    ```

    Here, we created our own middleware that prints `do something...` in the console.

2. Second we need to load our middleware in `app.ts` before app bootstrap:

    ```typescript
    import "reflect-metadata";
    import {createExpressServer} from "routing-controllers";
    import "./UserController";
    import "./MyMiddleware"; // here we load it
    createExpressServer().listen(3000);
    ```

3. Now we can use our middleware:

    ```typescript
    import {Controller, UseBefore} from "routing-controllers";
    import {MyMiddleware} from "./MyMiddleware";

    @Controller()
    @UseBefore(MyMiddleware)
    export class UserController {

    }
    ```

    or per-action:

    ```typescript
    @Get("/users/:id")
    @UseBefore(MyMiddleware)
    getOne(@Param("id") id: number) {
        // ...
    }
    ```

    This way your middleware will be executed each time before controller action.
    You can use `@UseAfter(MyMiddleware)` to make it execute after each controller action.

### Creating your own koa middleware

Here is example of creating middleware for koa.js:

1. To create your own middleware you need to create a class that implements a `MiddlewareInterface` interface and decorated
with `@Middleware` decorator:

    ```typescript
    import {Middleware, MiddlewareInterface} from "routing-controllers";

    @Middleware()
    export class MyMiddleware implements MiddlewareInterface {

        use(context: any, next: (err: any) => Promise<any>): Promise<any> {
            console.log("do something before execution...");
            return next().then(() => {
                console.log("do something after execution");
            }).catch(error => {
                console.log("error handling is also here");
            });
        }

    }
    ```

    Here, we created our own middleware that prints `do something...` in the console.

2. Second we need to load our middleware in `app.ts` before app bootstrap:

    ```typescript
    import "reflect-metadata";
    import {createKoaServer} from "routing-controllers";
    import "./UserController";
    import "./MyMiddleware"; // here we load it
    createKoaServer().listen(3000);
    ```

3. Now we can use our middleware:

    ```typescript
    import {Controller, UseBefore} from "routing-controllers";
    import {MyMiddleware} from "./MyMiddleware";

    @Controller()
    @UseBefore(MyMiddleware)
    export class UserController {

    }
    ```

    or per-action:

    ```typescript
    @Get("/users/:id")
    @UseBefore(MyMiddleware)
    getOne(@Param("id") id: number) {
        // ...
    }
    ```

    This way your middleware will be executed each time before controller action.
    You can use `@UseAfter(MyMiddleware)` to make it execute after each controller action.

### Global middlewares

Same way you created a middleware, you can create a global middleware:

```typescript
import {MiddlewareGlobalBefore, MiddlewareInterface} from "routing-controllers";

@MiddlewareGlobalBefore()
export class CompressionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next: (err: any) => any): void {
        let compression = require("compression");
        return compression()(request, response, next);
    }

}
```
In this example we simply delegate middleware to compression to use it globally.
Global middleware runs before each request, always.

You can make global middleware to run after controller action by using `@MiddlewareGlobalAfter` instead of `@MiddlewareGlobalBefore`.
 If you have issues with global middlewares run execution order you can set a priority: `@MiddlewareGlobalBefore({ priority: 1 })`.
 Higher priority means middleware being executed earlier.

### Error handlers

Error handlers are specific only to express.
Error handlers work in pretty much the same way as middlewares, but implement `ErrorMiddlewareInterface` instead of `MiddlewareInterface`:

1. Create a class that implements the `ErrorMiddlewareInterface` interface and is decorated with the `@MiddlewareGlobalAfter` decorator:

    ```typescript
    import {ErrorMiddlewareInterface, MiddlewareGlobalAfter} from "routing-controllers";

    @MiddlewareGlobalAfter()
    export class CustomErrorHandler implements ErrorMiddlewareInterface {

        error(error: any, request: any, response: any, next: (err: any) => any) {
            console.log("do something...");
            next();
        }

    }
    ```
Custom error handlers are invoked after the default error handler, so you won't be able to change response code or headers.
To prevent this, you have to disable default error handler by specyfing `defaultErrorHandler` option in createExpressServer or useExpressServer:

```typescript
createExpressServer({
    defaultErrorHandler: false // disable default error handler, only if you have your own error handler
}).listen(3000);
```

## Using interceptors

Interceptors are used to change or replace the data returned to the client.
You can create your own interceptor class or function and use to all or specific controller or controller action.
It works pretty much the same as middlewares.

### Interceptor function

The easiest way is to use functions directly passed to `@UseInterceptor` of the action. 

```typescript
import {Get, Param, UseInterceptor} from "routing-controllers";

// ...

@Get("/users")
@UseInterceptor(function(request: any, response: any, content: any) {
    // here you have content returned by this action. you can replace something 
    // in it and return a replaced result. replaced result will be returned to the user
    return content.replace(/Mike/gi, "Michael");
})
getOne(@Param("id") id: number) {
    return "Hello, I am Mike!"; // client will get a "Hello, I am Michael!" response.
}
```

You can use `@UseInterceptor` per-action, on per-controller. 
If its used per-controller then interceptor will apply to all controller actions.

### Interceptor classes

You can also create a class and use it with `@UseInterceptor` decorator:

```typescript
import {Interceptor, InterceptorInterface} from "routing-controllers";

@Interceptor()
export class NameCorrectionInterceptor implements InterceptorInterface {
    
    intercept(request: any, response: any, content: any) {
        return content.replace(/Mike/gi, "Michael");
    }
    
}
```

And use it in your controllers this way:

```typescript
import {Get, Param, UseInterceptor} from "routing-controllers";
import {NameCorrectionInterceptor} from "./NameCorrectionInterceptor";

// ...

@Get("/users")
@UseInterceptor(NameCorrectionInterceptor)
getOne(@Param("id") id: number) {
    return "Hello, I am Mike!"; // client will get a "Hello, I am Michael!" response.
}
```

### Global interceptors

You can create interceptors that will affect all controllers in your project by creating interceptor class
and mark it with `@InterceptorGlobal` decorator:

```typescript
import {InterceptorGlobal, InterceptorInterface} from "routing-controllers";

@InterceptorGlobal()
export class NameCorrectionInterceptor implements InterceptorInterface {
    
    intercept(request: any, response: any, content: any) {
        return content.replace(/Mike/gi, "Michael");
    }
    
}
```

### Don't forget to load your middlewares, error handlers and interceptors

Middlewares and error handlers should be loaded globally the same way as controllers, before app bootstrap:

```typescript
import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import "./UserController";
import "./MyMiddleware"; // here we load it
import "./CustomErrorHandler"; // here we load it
import "./BadWordInterceptor"; // here we load it
let app = createExpressServer();
app.listen(3000);
```

Also you can load middlewares from directories. Also you can use glob patterns:

```typescript
import "reflect-metadata";
import {createExpressServer, loadControllers} from "routing-controllers";
createExpressServer({
    controllers: [__dirname + "/controllers/**/*.js"],
    middlewares: [__dirname + "/middlewares/**/*.js"]
}).listen(3000);
```

## Creating instances of classes from action params

When user sends a json object and you are parsing it, sometimes you want to parse it into object of some class,
instead of parsing it into simple literal object.
You have ability to do this using [class-transformer][4].
To use it simply specify a `useConstructorUtils: true` option on application bootstrap:

```typescript
import "reflect-metadata";
import {createExpressServer, useContainer, loadControllers} from "routing-controllers";

createExpressServer({
    useClassTransformer: true
}).listen(3000);
```

Now, when you parse your action params, if you have specified a class, routing-controllers will create you a class
of that instance with the data sent by a user:

```typescript
export class User {
    firstName: string;
    lastName: string;

    getName(): string {
        return this.lastName + " " + this.firstName;
    }
}

@Controller()
export class UserController {

    post(@Body() user: User) {
        console.log("saving user " + user.getName());
    }

}
```

This technique works not only with `@Body`, but also with `@Param`, `@QueryParam`, `@BodyParam` and other decorators.
Learn more about class-transformer and how to handle more complex object constructions [here][4].
This behaviour is enabled by default.
If you want to disable it simply pass `useConstructorUtils: false` to createExpressServer method.

## Default error handling

Routing-controller comes with default error handling mechanism.

## Using DI container

`routing-controllers` supports a DI container out of the box. You can inject your services into your controllers,
middlewares and error handlers. Container must be setup during application bootstrap.
Here is example how to integrate routing-controllers with [typedi](https://github.com/pleerock/typedi):

```typescript
import "reflect-metadata";
import {createExpressServer, useContainer} from "routing-controllers";
import {Container} from "typedi";

// its important to set container before any operation you do with routing-controllers,
// including importing controllers
useContainer(Container);

// create and run server
createExpressServer({
    controllers: [__dirname + "/controllers/*.js"],
    middlewares: [__dirname + "/middlewares/*.js"],
    interceptors: [__dirname + "/interceptor/*.js"],
}).listen(3000);
```

That's it, now you can inject your services into your controllers:

```typescript
@Controller()
export class UsersController {

    constructor(private userRepository: UserRepository) {
    }

    // ... controller actions

}
```

## Decorators Reference

#### Controller Decorators

| Signature                            | Example                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|--------------------------------------|------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@Controller(baseRoute: string)`     | `@Controller("/users") class SomeController`         | Class that is marked with this decorator is registered as controller and its annotated methods are registered as actions. Base route is used to concatenate it to all controller action routes.                                                                                                                                                                                                                                                     |
| `@JsonController(baseRoute: string)` | `@JsonController("/users") class SomeJsonController` | Class that is marked with this decorator is registered as controller and its annotated methods are registered as actions. Difference between @JsonController and @Controller is that @JsonController automatically converts results returned by controller to json objects (using JSON.parse) and response being sent to a client is sent with application/json content-type. Base route is used to concatenate it to all controller action routes. |

#### Controller Method Decorators

| Signature                                                                    | Example                                | Description                                                                                                                                                                                                       | express.js analogue                  |
|------------------------------------------------------------------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `@Get(route: string|RegExp)`                                                 | `@Get("/users") all()`                 | Methods marked with this decorator will register a request made with GET HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                 | `app.get("/users", all)`             |
| `@Post(route: string|RegExp)`                                                | `@Post("/users") save()`               | Methods marked with this decorator will register a request made with POST HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                | `app.post("/users", save)`           |
| `@Put(route: string|RegExp)`                                                 | `@Put("/users/:id") update()`          | Methods marked with this decorator will register a request made with PUT HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                 | `app.put("/users", update)`          |
| `@Patch(route: string|RegExp)`                                               | `@Patch("/users/:id") patch()`         | Methods marked with this decorator will register a request made with PATCH HTTP Method to a given route. In action options you can specify if action should response json or regular text response.               | `app.patch("/users/:id", patch)`     |
| `@Delete(route: string|RegExp)`                                              | `@Delete("/users/:id") delete()`       | Methods marked with this decorator will register a request made with DELETE HTTP Method to a given route. In action options you can specify if action should response json or regular text response.              | `app.delete("/users/:id", delete)`   |
| `@Head(route: string|RegExp)`                                                | `@Head("/users/:id") head()`           | Methods marked with this decorator will register a request made with HEAD HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                | `app.head("/users/:id", head)`       |
| `@Options(route: string|RegExp)`                                             | `@Options("/users/:id") head()`        | Methods marked with this decorator will register a request made with OPTIONS HTTP Method to a given route. In action options you can specify if action should response json or regular text response.             | `app.options("/users/:id", options)` |
| `@Method(methodName: string, route: string|RegExp)`                          | `@Method("move", "/users/:id") move()` | Methods marked with this decorator will register a request made with given `methodName` HTTP Method to a given route. In action options you can specify if action should response json or regular text response.  | `app.move("/users/:id", move)`       |

#### Method Parameter Decorators

| Signature                                                          | Example                                          | Description                                                                                                                                                                                                                                                                  | express.js analogue                       |
|--------------------------------------------------------------------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| `@Req()`                                                           | `getAll(@Req() request: Request)`                | Injects a Request object to a controller action parameter value                                                                                                                                                                                                              | `function (request, response)`            |
| `@Res()`                                                           | `getAll(@Res() response: Response)`              | Injects a Reponse object to a controller action parameter value                                                                                                                                                                                                              | `function (request, response)`            |
| `@Body(options?: ParamOptions)`                                    | `post(@Body() body: any)`                        | Injects a body to a controller action parameter value. In options you can specify if body should be parsed into a json object or not. Also you can specify there if body is required and action cannot work without body being specified.                                    | `request.body`                            |
| `@Param(name: string, options?: ParamOptions)`                     | `get(@Param("id") id: number)`                   | Injects a parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if parameter is required and action cannot work with empty parameter.                             | `request.params.id`                       |
| `@Session(objectName: string, options?: ParamOptions)`             | `get(@Session("user") user: User)`               | Injects an object from session to a controller action parameter value. In options you can specify there if parameter is not required and action can work with empty parameter.                             | `request.session.user`                       |
| `@Session()`                                                       | `get(@Session() session: express.Session)`       | Injects a whole session object to a controller action parameter value. A session object is required and action cannot work with empty parameter.                             | `request.session`                       |
| `@QueryParam(name: string, options?: ParamOptions)`                | `get(@QueryParam("id") id: number)`              | Injects a query string parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if query parameter is required and action cannot work with empty parameter.          | `request.query.id`                        |
| `@HeaderParam(name: string, options?: ParamOptions)`               | `get(@HeaderParam("token") token: string)`       | Injects a parameter from response headers to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if query parameter is required and action cannot work with empty parameter. | `request.headers.token`                   |
| `@UploadedFile(name: string, options?: { required?: boolean })`    | `post(@UploadedFile("files") file: any)`         | Injects a "file" from the response to a controller action parameter value. In parameter options you can specify if this is required parameter or not. parseJson option is ignored                                                                                            | `request.file.file` (when using multer)   |
| `@UploadedFiles(options?: ParamOptions)`                           | `post(@UploadedFiles() files: any[])`            | Injects all uploaded files from the response to a controller action parameter value. In parameter options you can specify if this is required parameter or not. parseJson option is ignored                                                                                  | `request.files` (when using multer)       |
| `@BodyParam(name: string, options?: ParamOptions)`                 | `post(@BodyParam("name") name: string)`          | Injects a body parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if body parameter is required and action cannot work with empty parameter.                   | `request.body.name`                       |
| `@CookieParam(name: string, options?: ParamOptions)`               | `get(@CookieParam("username") username: string)` | Injects a cookie parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if cookie parameter is required and action cannot work with empty parameter.               | `request.cookie("username")`              |

#### Middleware and Interceptor Decorators

| Signature                                                          | Example                                          | Description                                                                                                     |
|--------------------------------------------------------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `@Middleware()`                                                    | `@Middleware() class SomeMiddleware`             | Registers a new middleware.                                                                                     |
| `@MiddlewareGlobalBefore()`                                        | `@MiddlewareGlobalBefore() class SomeMiddleware` | Registers a middleware that runs globally before action execution.                                              |
| `@MiddlewareGlobalAfter()`                                         | `@MiddlewareGlobalAfter() class SomeMiddleware`  | Registers a middleware that runs globally after action execution.                                               |
| `@ErrorHandler()`                                                  | `@ErrorHandler() class SomeErrorHandler`         | Registers a new error handler.                                                                                  |
| `@UseBefore()`                                                     | `@UseBefore(CompressionMiddleware)`              | Uses given middleware before action is being executed.                                                          |
| `@UseAfter()`                                                      | `@UseAfter(CompressionMiddleware)`               | Uses given middleware after action is being executed.                                                           |
| `@Interceptor()`                                                   | `@Interceptor(InterceptorMiddleware)`            | Registers a given class as an interceptor                                                                       |
| `@InterceptorGlobal()`                                             | `@InterceptorGlobal(InterceptorMiddleware)`      | Registers a global interceptor.                                                                                 |
| `@UseInterceptor()`                                                | `@UseInterceptor(InterceptorMiddleware)`         | Uses given interceptor for the given action or controller.                                                      |

#### Other Decorators

| Signature                                                          | Example                                           | Description                                                                                                     |
|--------------------------------------------------------------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `@JsonResponse()`                                                  | `@JsonResponse()` get()                           | Controller actions marked with this decorator will return a json response instead of default text/html.         |
| `@TextResponse()`                                                  | `@TextResponse()` get()                           | Controller actions marked with this decorator will return a text/html response instead of default json.         |
| `@HttpCode(code: number)`                                          | `@HttpCode(201)` post()                           | Allows to explicitly set HTTP code to be returned in the response.                                              |
| `@EmptyResultCode(code: number)`                                   | `@EmptyResultCode(201)` post()                    | Sets a given HTTP code when controller action returned empty result (null or undefined).                        |
| `@NullResultCode(code: number)`                                    | `@NullResultCode(201)` post()                     | Sets a given HTTP code when controller action returned null.                                                    |
| `@UndefinedResultCode(code: number)`                               | `@UndefinedResultCode(201)` post()                | Sets a given HTTP code when controller action returned undefined.                                               |
| `@ResponseClassTransformOptions(options: ClassTransformOptions)`   | `@ResponseClassTransformOptions({/*...*/})` get() | Sets options to be passed to class-transformer when it used for classToPlain a response result.                 |
| `@ContentType(contentType: string)`                                | `@ContentType("text/csv")` get()                  | Allows to explicitly set HTTP Content-type returned in the response.                                            |
| `@Header(contentType: string)`                                     | `@Header("Cache-Control", "private")` get()       | Allows to explicitly set any HTTP Header returned in the response.                                              |
| `@Location(url: string)`                                           | `@Location("http://github.com")` get()            | Allows to explicitly set HTTP Location.                                                                         |
| `@Redirect(url: string)`                                           | `@Redirect("http://github.com")` get()            | Allows to explicitly set HTTP Redirect.                                                                         |
| `@Render(template: string)`                                        | `@Render("user-list.html")` get()                 | Renders a given html when user accesses route.                                                                  |

## Samples

* Take a look on [routing-controllers with express](https://github.com/pleerock/routing-controllers-express-demo) which is using routing-controllers.
* Take a look on [routing-controllers with koa](https://github.com/pleerock/routing-controllers-koa-demo) which is using routing-controllers.
* Take a look on [routing-controllers with angular 2](https://github.com/pleerock/routing-controllers-angular2-demo) which is using routing-controllers.
* Take a look on [node-microservice-demo](https://github.com/swimlane/node-microservice-demo) which is using routing-controllers.
* Take a look on samples in [./sample](https://github.com/pleerock/routing-controllers/tree/master/sample) for more examples
of usage.

## Release notes

See information about breaking changes and release notes [here](https://github.com/pleerock/routing-controllers/tree/master/doc/release-notes.md).

[1]: http://expressjs.com/
[2]: http://koajs.com/
[3]: https://github.com/expressjs/multer
[4]: https://github.com/pleerock/class-transformer
[5]: https://www.npmjs.com/package/express-session

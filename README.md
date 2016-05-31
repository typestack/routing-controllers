# routing-controllers

Allows to create controller classes with methods as actions that handle requests.

Right now it works only with express.js. If you are interested to make it work with other frameworks, feel free to
contribute and implement integrations with other frameworks.

## Installation

1. Install module:

    `npm install routing-controllers --save`

2. Use [typings](https://github.com/typings/typings) to install all required definition dependencies.

    `typings install`

3. ES6 features are used, so you may want to install [es6-shim](https://github.com/paulmillr/es6-shim) too:

    `npm install es6-shim --save`

    if you are building nodejs app, you may want to `require("es6-shim");` in your app.
    or if you are building web app, you man want to add `<script src="path-to-shim/es6-shim.js">` on your page.

## Simple usage

1. Create a file `UserController.ts`

    ```typescript
    import {Request, Response} from "express";
    import {Controller} from "routing-controllers/decorator/Controllers";
    import {Get, Post, Put, Patch, Delete} from "routing-controllers/decorator/Methods";
    import {Req, Res} from "routing-controllers/decorator/Params";

    @Controller()
    export class UserController {

        @Get("/users")
        getAll() {
            return "Hello all users";
        }

        @Get("/users/:id")
        getOne(@Req() request: Request, @Res() response: Response) {
            response.send("Hello user #" + request.param("id"));
        }

        @Post("/users")
        post(@Req() request: Request, @Res() response: Response) {
            // implement saving here
            // use request and response like you always do with express.js ...
        }

        @Put("/users/:id")
        put(@Req() request: Request, @Res() response: Response) {
            // implement saving here
            // use request and response like you always do with express.js ...
        }

        @Patch("/users/:id")
        patch(@Req() request: Request, @Res() response: Response) {
            // implement saving here
            // use request and response like you always do with express.js ...
        }

        @Delete("/users/:id")
        remove(@Req() request: Request, @Res() response: Response) {
            // implement removing here
            // use request and response like you always do with express.js ...
        }

    }
    ```

    This class will register routes specified in method decorators in your server framework (express.js).

2. Create a file `app.ts`

    ```typescript
    import * as express from "express";
    import {useExpressServer} from "routing-controllers";
    import "./UserController";  // we need to "load" our controller

    let app = express(); // create express application
    useExpressServer(app); // register controllers routes in our express application
    app.listen(3000); // now we can run your express application.
    ```

3. Open browser on `http://localhost:3000/users`. You should see `Hello all users` in your browser. If you open
 `http://localhost:3000/users/1` you should see `Hello user #1` in your browser.

## More usage examples

#### Load all controllers from the given directory

You probably don't want to *require* every controller in your app, and instead want to load all controllers from
specific directory. To do it you can install [require-all](https://www.npmjs.com/package/require-all) package and use
it like this:

```typescript
import * as express from "express";
import {useExpressServer} from "routing-controllers";
var controllers = require('require-all')({
    dirname     :  __dirname + '/controllers',
    filter      :  /(.+Controller)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    recursive   : true
});

let app = express(); // create express application
useExpressServer(app); // register controllers routes in our express application
app.listen(3000); // now we can run your express application.
```

#### Set response body value returned by a controller action

To return a response body you usually do `response.send("Hello world!")`. But there is alternative way of doing it.
You can also return result right from the controller, and this result will be pushed via response.send()

```typescript
@Get("/users")
getAll() {
    return "Hello World!";
}

// its the same as:
// request.send("Hello World!");
```

You can also return a Promise (object that contains .then method), and its result will be pushed to response.send after
promise is resolved.

```typescript
@Get("/users")
getAll() {
    return Database.loadUsers();
}

// its the same as Database.loadUsers().then(
//     result => request.send(result),
//     error  => { request.status(500); request.send(error) }
// );
```

#### Output JSON instead of regular text content

If you are designing a REST API where your endpoints always return JSON you can use `@JsonController` decorator instead
of `@Controller`. This will guarantee you that data returned by your controller actions always be transformed to JSON
objects and `Content-Type` header will be always set to `application/json`:


```typescript
    @JsonController()
    export class UserController {
        // ...
    }
```

#### Inject parameters

You can inject some common params you may need right into the controller action method using proper decorators:

```typescript
@Get("/users/:id")
getAll( @Req() request: Request,
        @Res() response: Response,
        @Body() requestBody: any,
        @Param("id") id: number,
        @QueryParam("name") name: string) {
    // now you can use your parameters
}

// its the same as: 
// let requestBody = response.body;
// let id = response.params.id;
// let name = response.query.name; 
```

#### Inject body and transform it to object

If you want to have response body and wish it to be automatically converted to object you need to use @Body
parameter decorator and specify extra parameters to it:

```typescript
@Post("/users")
save(@Body({ parseJson: true }) user: any) {
    // now you can use user as object
}

// its the same as:
// let user: any = JSON.parse(response.body);
```

There is also simplified way of doing it: `save(@Body(true) user: any)`

#### Make body required

If you want to have response body and wish it to be automatically converted to object you need to use @Body
parameter decorator and specify extra parameters to it:

```typescript
@Post("/users")
save(@Body({ required: true }) user: any) {
    // your method will not be executed if user is not sent in a request
}
```

Same you can do with all other parameter inectors: @Param, @QueryParam, @BodyParam and others.

#### Inject parameters and transform them to objects

You can inject some common params you may need right into the controller action method using proper decorators:

```typescript
@Get("/users")
getAll(@QueryParam("filter", { required: true }) filter: UserFilter) {
    // now you can use your filter, for example
    if (filter.showAll === true)
        return "all users";

    return "not all users";
}

// you can send a request to http://localhost:3000/users?filter={"showAll": true}
// and it will show you "all users"

```

## Decorators Documentation

#### Controller Decorators

| Signature                           | Example                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------------------|------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Controller(baseRoute: string)`     | `@Controller("/users") class SomeController`         | Class that is marked with this decorator is registered as controller and its annotated methods are registered as actions. Base route is used to concatenate it to all controller action routes.                                                                                                                                                                                                                                                     |
| `JsonController(baseRoute: string)` | `@JsonController("/users") class SomeJsonController` | Class that is marked with this decorator is registered as controller and its annotated methods are registered as actions. Difference between @JsonController and @Controller is that @JsonController automatically converts results returned by controller to json objects (using JSON.parse) and response being sent to a client is sent with application/json content-type. Base route is used to concatenate it to all controller action routes. |

#### Controller Method Decorators

| Signature                                                                   | Example                                | Description                                                                                                                                                                                                       | express.js analogue                  |
|-----------------------------------------------------------------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `Get(route: string|RegExp, options?: ActionOptions)`                        | `@Get("/users") all()`                 | Methods marked with this decorator will register a request made with GET HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                | `app.get("/users", all)`             |
| `Post(route: string|RegExp, options?: ActionOptions)`                       | `@Post("/users") save()`               | Methods marked with this decorator will register a request made with POST HTTP Method to a given route. In action options you can specify if action should response json or regular text response.               | `app.post("/users", save)`           |
| `Put(route: string|RegExp, options?: ActionOptions)`                        | `@Put("/users/:id") update()`          | Methods marked with this decorator will register a request made with PUT HTTP Method to a given route. In action options you can specify if action should response json or regular text response.                | `app.put("/users", update)`          |
| `Patch(route: string|RegExp, options?: ActionOptions)`                      | `@Patch("/users/:id") patch()`         | Methods marked with this decorator will register a request made with PATCH HTTP Method to a given route. In action options you can specify if action should response json or regular text response.              | `app.patch("/users/:id", patch)`     |
| `Delete(route: string|RegExp, options?: ActionOptions)`                     | `@Delete("/users/:id") delete()`       | Methods marked with this decorator will register a request made with DELETE HTTP Method to a given route. In action options you can specify if action should response json or regular text response.             | `app.delete("/users/:id", delete)`   |
| `Head(route: string|RegExp, options?: ActionOptions)`                       | `@Head("/users/:id") head()`           | Methods marked with this decorator will register a request made with HEAD HTTP Method to a given route. In action options you can specify if action should response json or regular text response.               | `app.head("/users/:id", head)`       |
| `Options(route: string|RegExp, options?: ActionOptions)`                    | `@Options("/users/:id") head()`        | Methods marked with this decorator will register a request made with OPTIONS HTTP Method to a given route. In action options you can specify if action should response json or regular text response.            | `app.options("/users/:id", options)` |
| `Method(methodName: string, route: string|RegExp, options?: ActionOptions)` | `@Method("move", "/users/:id") move()` | Methods marked with this decorator will register a request made with given `methodName` HTTP Method to a given route. In action options you can specify if action should response json or regular text response. | `app.move("/users/:id", move)`       |

#### Method Parameter Decorators

| Signature                                           | Example                                          | Description                                                                                                                                                                                                                                                         | express.js analogue            |
|-----------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|
| `Req()`                                             | `getAll(@Req() request: Request)`                | Injects a Request object to a controller action parameter value                                                                                                                                                                                                     | `function (request, response)` |
| `Res()`                                             | `getAll(@Res() response: Response)`              | Injects a Reponse object to a controller action parameter value                                                                                                                                                                                                     | `function (request, response)` |
| `Body(options: ParamOptions)`                       | `save(@Body() body: any)`                        | Injects a body to a controller action parameter value. In options you can specify if body should be parsed into a json object or not. Also you can specify there if body is required and action cannot work without body being specified.                           | `request.body`                 |
| `Param(name: string, options?: ParamOptions)`       | `get(@Param("id") id: number)`                   | Injects a parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if parameter is required and action cannot work with empty parameter.                    | `request.params.id`            |
| `QueryParam(name: string, options?: ParamOptions)`  | `get(@QueryParam("id") id: number)`              | Injects a query string parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if query parameter is required and action cannot work with empty parameter. | `request.query.id`             |
| `BodyParam(name: string, options?: ParamOptions)`   | `post(@BodyParam("name") name: string)`          | Injects a body parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if body parameter is required and action cannot work with empty parameter.          | `request.body.name`            |
| `CookieParam(name: string, options?: ParamOptions)` | `get(@CookieParam("username") username: string)` | Injects a cookie parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if cookie parameter is required and action cannot work with empty parameter.      | `request.cookie("username")`   |

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/routing-controllers/tree/master/sample) for more examples
of usage.

## Todos

* cover with tests
* add reversed error override map
* integration with other frameworks (other then express.js) can be easily added, so PRs are welcomed

## Release notes

**0.6.0**

* middleware and error handlers support
* added beta support of koa v2 framework
* refactored core
* everything important is packed into "routing-controllers" main entrypoint now

**0.5.0**

* renamed package from `controllers.ts` to `routing-controllers`
* added integration with `constructor-utils` for serialization and deserialization

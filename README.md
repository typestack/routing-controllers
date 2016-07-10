# routing-controllers

Allows to create controller classes with methods as actions that handle requests.
You can use routing-controllers with [express.js][1] or [koa 2][2].

## Installation

1. Install module:

    `npm install routing-controllers --save`

2. `reflect-metadata` shim is required, so make sure to import it before you use the library,
in a global place, like app.ts:

    ```typescript
    import "reflect-metadata";
    ```

3. ES6 features are used, so you are using old version of node.js you may need to install a
 [es6-shim](https://github.com/paulmillr/es6-shim) too:

    `npm install es6-shim --save`

    and import it in a global place like app.ts:

    ```typescript
    import "es6-shim";
    ```

4. Install framework:

    a. If you want to use routing-controllers with express.js, then install express:

    `npm install express --save`

    Optionally you can also install its typings:

    `typings install dt~express --save --global`

    b. If you want to use routing-controllers with koa 2, then install it:

    `npm install koa@next --save`

    Optionally you can also install its typings:

    `typings install dt~koa --save --global`

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

    This class will register routes specified in method decorators in your server framework (express.js).

2. Create a file `app.ts`

    a. If you are using express:

    ```typescript
    import "reflect-metadata"; // this shim is required
    import {createExpressServer} from "routing-controllers";
    import "./UserController";  // we need to "load" our controller. this is required
    createExpressServer().listen(3000); // register controllers routes in our express application
    ```

    b. If you are using koa v2:

    ```typescript
    import "reflect-metadata"; // this shim is required
    import {createKoaServer} from "routing-controllers";
    import "./UserController";  // we need to "load" our controller. this is required
    createKoaServer().listen(3000); // register controllers routes in our express application
    ```

3. Open in browser `http://localhost:3000/users`. You should see `This action returns all users` in your browser. If you open
 `http://localhost:3000/users/1` you should see `This action returns user #1` in your browser.

## More usage examples

#### Return promises

You can return a promise in the controller, and it will wait until promise resolves and return in a response a promise result.

```typescript
import {Controller, Param, Body, Get, Post, Put, Delete} from "routing-controllers";

@Controller()
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

You can use express's (or koa's) request and response objects this way:

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
If you have installed a express (or koa) typings too, you can use their types:

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

#### Using exist express server instead of creating a new one

If you have, or if you want to create and configure express (or koa) app separately,
you can use `useExpressServer` instead of `createExpressServer` function:

```typescript
import "reflect-metadata"; // this shim is required
import {useExpressServer} from "routing-controllers";

let app = express(); // your created express server
// app.use() // maybe you configure itself the way you want
useExpressServer(app); // register created express server in routing-controllers
app.listen(3000); // run your express server
```

#### Load all controllers from the given directory

You can load all controllers in once from specific directories, by specifying array of directories via options in
`createExpressServer` or `useExpressServer`:

```typescript
import "reflect-metadata"; // this shim is required
import {createExpressServer, loadControllers} from "routing-controllers";
createExpressServer({
    controllerDirs: [__dirname + "/controllers"]
}).listen(3000); // register controllers routes in our express application
```

#### Load all controllers from the given directory and prefix routes

If you want to prefix all routes in some directory eg. /api 

```typescript
import "reflect-metadata";
import {createExpressServer} from "routing-controllers";

createExpressServer({
    routePrefix: "/api",
    controllerDirs: [__dirname + "/api"] // register controllers routes in our express app
}).listen(3000);
```

#### Output JSON instead of regular text content

If you are designing a REST API where your endpoints always return JSON you can use `@JsonController` decorator instead
of `@Controller`. This will guarantee you that data returned by your controller actions always be transformed to JSON
 and `Content-Type` header will be always set to `application/json`:


```typescript
@JsonController()
export class UserController {
    // ...
}
```

#### Per-action json / non-json output

In the case if you want to control if your controller's action will return json or regular plain text,
you can specify a special option:

```typescript
@Get("/users", { responseType: "json" }) // this will ignore @Controller and return a json in a response
getUsers() {
}
@Get("/posts", { responseType: "text" }) // this will ignore @JsonController and return a regular text in a response
getPosts() {
}
```

#### Inject parameters

##### Routing parameters

You can use parameters in your routes, and to inject such parameters in your controller methods you must use `@Param` decorator:

```typescript
@Get("/users/:id")
getUsers(@Param("id") id: number) {
}
```

##### Query parameters

To inject query parameters, use `@QueryParam` decorator:

```typescript
@Get("/users")
getUsers(@QueryParam("limit") limit: number) {
}
```

##### Request body

To inject request body, use `@Body` decorator:

```typescript
@Post("/users")
saveUser(@Body() user: User) {
}
```

##### Request body parameters

To inject request body parameter, use `@BodyParam` decorator:

```typescript
@Post("/users")
saveUser(@BodyParam("name") userName: string) {
}
```

##### Request header parameters

To inject request header parameter, use `@HeaderParam` decorator:

```typescript
@Post("/users")
saveUser(@HeaderParam("authorization") token: string) {
}
```

##### Request file parameters

To inject uploaded file, use `@FileParam` decorator:

```typescript
@Post("/files")
saveFile(@FileParam("fileName") file: any) {
}
```

Routing-controllers uses [multer][2] to handle file uploadings.
You can install multer's file definitions via typings, and use `files: File[]` type instead of `any[]`.

##### All request's file parameters

To inject all uploaded files, use `@Files` decorator:

```typescript
@Post("/files")
saveAll(@Files() files: any[]) {
}
```

Routing-controllers uses [multer][2] to handle file uploadings.
You can install multer's file definitions via typings, and use `files: File[]` type instead of `any[]`.

##### Cookie parameter

To cookie parameter, use `@CookieParam` decorator:

```typescript
@Post("/files")
saveAll(@Files() files: any[]) {
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

| Signature                                                         | Example                                          | Description                                                                                                                                                                                                                                                                  | express.js analogue                       |
|-------------------------------------------------------------------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| `Req()`                                                           | `getAll(@Req() request: Request)`                | Injects a Request object to a controller action parameter value                                                                                                                                                                                                              | `function (request, response)`            |
| `Res()`                                                           | `getAll(@Res() response: Response)`              | Injects a Reponse object to a controller action parameter value                                                                                                                                                                                                              | `function (request, response)`            |
| `Body(options: ParamOptions)`                                     | `save(@Body() body: any)`                        | Injects a body to a controller action parameter value. In options you can specify if body should be parsed into a json object or not. Also you can specify there if body is required and action cannot work without body being specified.                                    | `request.body`                            |
| `Param(name: string, options?: ParamOptions)`                     | `get(@Param("id") id: number)`                   | Injects a parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if parameter is required and action cannot work with empty parameter.                             | `request.params.id`                       |
| `QueryParam(name: string, options?: ParamOptions)`                | `get(@QueryParam("id") id: number)`              | Injects a query string parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if query parameter is required and action cannot work with empty parameter.          | `request.query.id`                        |
| `HeaderParam(name: string, options?: ParamOptions)`               | `get(@HeaderParam("token") token: string)`       | Injects a parameter from response headers to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if query parameter is required and action cannot work with empty parameter. | `request.headers.token`                   |
| `FileParam(name: string, options?: { required?: boolean })`       | `get(@FileParam("files") file: any)`             | Injects a "file" from the response to a controller action parameter value. In parameter options you can specify if this is required parameter or not. parseJson option is ignored                                                                                            | `request.file.file` (when using multer)   |
| `FilesParam(options?: ParamOptions)`                              | `get(@FilesParam() files: any[])`                | Injects all uploaded files from the response to a controller action parameter value. In parameter options you can specify if this is required parameter or not. parseJson option is ignored                                                                                  | `request.files` (when using multer)       |
| `BodyParam(name: string, options?: ParamOptions)`                 | `post(@BodyParam("name") name: string)`          | Injects a body parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if body parameter is required and action cannot work with empty parameter.                   | `request.body.name`                       |
| `CookieParam(name: string, options?: ParamOptions)`               | `get(@CookieParam("username") username: string)` | Injects a cookie parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if cookie parameter is required and action cannot work with empty parameter.               | `request.cookie("username")`              |

## More samples

Take a look on samples in [./sample](https://github.com/pleerock/routing-controllers/tree/master/sample) for more examples
of usage.

## Release notes

**0.6.0**

* middleware and error handlers support
* added beta support of koa v2 framework
* refactored core
* everything important is packed into "routing-controllers" main entrypoint now

**0.5.0**

* renamed package from `controllers.ts` to `routing-controllers`
* added integration with `constructor-utils` for serialization and deserialization

[1]: http://expressjs.com/
[2]: https://github.com/expressjs/multer
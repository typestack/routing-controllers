# routing-controllers

Allows to create controller classes with methods as actions that handle requests.
Routing-controllers is built upon [express.js][1].

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

4. Additionally you can install express [typings](https://github.com/typings/typings):

    `typings install dt~express dt~serve-static --save --global`

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

    ```typescript
    import "reflect-metadata"; // this shim is required
    import {createExpressServer} from "routing-controllers";
    import "./UserController";  // we need to "load" our controller. this is required
    let app = createExpressServer(); // creates express app, registers all controller routes and returns you express app instance
    app.listen(3000); // run express application
    ```

3. Open in browser `http://localhost:3000/users`. You should see `This action returns all users` in your browser. If you open
 `http://localhost:3000/users/1` you should see `This action returns user #1` in your browser.

## More usage examples

#### Return promises

You can return a promise in the controller, and it will wait until promise resolved and return in a response a promise result.

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

You can use express's request and response objects this way:

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

#### Using exist express server instead of creating a new one

If you have, or if you want to create and configure express app separately,
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

#### Per-action JSON / non-JSON output

In the case if you want to control if your controller's action will return json or regular plain text,
you can specify a special option:

```typescript
// this will ignore @Controller if it used and return a json in a response
@Get("/users", { responseType: "json" })
getUsers() {
}

// this will ignore @JsonController if it used and return a regular text in a response
@Get("/posts", { responseType: "text" })
getPosts() {
}
```

#### Inject routing parameters

You can use parameters in your routes, and to inject such parameters in your controller methods you must use `@Param` decorator:

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

#### Inject uploaded file

To inject uploaded file, use `@UploadedFile` decorator:

```typescript
@Post("/files")
saveFile(@UploadedFile("fileName") file: any) {
}
```

Routing-controllers uses [multer][2] to handle file uploads.
You can install multer's file definitions via typings, and use `files: File[]` type instead of `any[]`.

#### Inject uploaded files

To inject all uploaded files, use `@UploadedFiles` decorator:

```typescript
@Post("/files")
saveAll(@UploadedFiles() files: any[]) {
}
```

Routing-controllers uses [multer][2] to handle file uploads.
You can install multer's file definitions via typings, and use `files: File[]` type instead of `any[]`.

#### Inject cookie parameter

To cookie parameter, use `@CookieParam` decorator:

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

You can convert any parameter you receive into object by specifying a `parseJson: true` option:

```typescript
@Get("/users")
getUsers(@QueryParam("filter", { parseJson: true }) filter: UserFilter) {
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
| `Body(options?: { required?: boolean })`                          | `post(@Body() body: any)`                        | Injects a body to a controller action parameter value. In options you can specify if body should be parsed into a json object or not. Also you can specify there if body is required and action cannot work without body being specified.                                    | `request.body`                            |
| `Param(name: string, options?: ParamOptions)`                     | `get(@Param("id") id: number)`                   | Injects a parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if parameter is required and action cannot work with empty parameter.                             | `request.params.id`                       |
| `QueryParam(name: string, options?: ParamOptions)`                | `get(@QueryParam("id") id: number)`              | Injects a query string parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if query parameter is required and action cannot work with empty parameter.          | `request.query.id`                        |
| `HeaderParam(name: string, options?: ParamOptions)`               | `get(@HeaderParam("token") token: string)`       | Injects a parameter from response headers to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if query parameter is required and action cannot work with empty parameter. | `request.headers.token`                   |
| `UploadedFile(name: string, options?: { required?: boolean })`    | `post(@UploadedFile("files") file: any)`            | Injects a "file" from the response to a controller action parameter value. In parameter options you can specify if this is required parameter or not. parseJson option is ignored                                                                                            | `request.file.file` (when using multer)   |
| `UploadedFiles(options?: ParamOptions)`                           | `post(@UploadedFiles() files: any[])`            | Injects all uploaded files from the response to a controller action parameter value. In parameter options you can specify if this is required parameter or not. parseJson option is ignored                                                                                  | `request.files` (when using multer)       |
| `BodyParam(name: string, options?: ParamOptions)`                 | `post(@BodyParam("name") name: string)`          | Injects a body parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if body parameter is required and action cannot work with empty parameter.                   | `request.body.name`                       |
| `CookieParam(name: string, options?: ParamOptions)`               | `get(@CookieParam("username") username: string)` | Injects a cookie parameter to a controller action parameter value. In options you can specify if parameter should be parsed into a json object or not. Also you can specify there if cookie parameter is required and action cannot work with empty parameter.               | `request.cookie("username")`              |

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/routing-controllers/tree/master/sample) for more examples
of usage.

## Release notes

**0.6.0**

* middleware and error handlers support
* refactored core
* everything packed into "routing-controllers" main entrypoint now

**0.5.0**

* renamed package from `controllers.ts` to `routing-controllers`
* added integration with `constructor-utils` for serialization and deserialization

[1]: http://expressjs.com/
[2]: https://github.com/expressjs/multer
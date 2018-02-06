# Controller actions

* What is Controller Action?
* Using Request and Response
* Returning content to the client
* Getting parameters
* Working with query parameters
* Getting request body
* Getting request body parameter
* Getting header parameters
* Getting cookie parameters
* Getting session parameters
* Handling uploaded files
* Required parameters

## What is Controller Action?

Controller action serves a single request from the client to a specific endpoint.
Here is example of controller action:

```typescript
import {JsonController, Get} from "routing-controllers";

@JsonController()
export class UserController {

    @Get("/users")
    all() {
        return getRepository(User).find();
    }

}
```

The most common decorators you can apply on controller actions are:

* `@Get()` - serves `GET` requests on the given route
* `@Post()` - serves `POST` requests on the given route
* `@Put()` - serves `PUT` requests on the given route
* `@Delete()` - serves `DELETE` requests on the given route
* `@Patch()` - serves `PATCH` requests on the given route

If you want more you can use `@Method("METHOD_NAME")` decorator, for example:

```typescript
@Method("MOVE", "/users")
move() {
}
```

## Using Request and Response

Each action execution is a request handling from the user.
You can use `Request` and `Response` objects in actions following way:

```typescript
import {JsonController, Get, Req, Res} from "routing-controllers";
import {Request, Response} from "express";

@JsonController()
export class UserController {
    
    @Get("/users")
    all(@Req() request: Request, @Req() response: Response) {
    }
    
}
```

You can work with those objects just like you would do it in express:

```typescript
import {JsonController, Get, Req, Res} from "routing-controllers";
import {Request, Response} from "express";

@JsonController()
export class UserController {
    
    @Get("/users/:id")
    one(@Req() request: Request, @Res() response: Response) {
        getRepository(User).findOne(request.params.id).then(user => {
            response.json(user);            
        });
    }
    
}
```

Learn more about Express [Request](http://expressjs.com/en/api.html#req) and [Response](http://expressjs.com/en/api.html#res).

## Returning content to the client

Routing-controllers automatically send returned by you content to the client.
For example: 

```typescript
import {JsonController, Get} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users")
    all() {
        return getRepository(User).find();
    }
    
}
```

In this case, if `find` method return you array of users they will be returned to the client.
If returning result is a promise, routing-controllers waits it to be resolved and returns content to the client.
So, basically this code is an equivalent to following code:

```typescript
import {JsonController, Get, Res} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users")
    all(@Res() response: Response) {
        getRepository(User).findOne().then(users => {
            response.json(users);            
        });
    }
    
}
```

## Getting parameters

Your request route can contain parameters, for example in `@Get("/users/:id")` id is a parameter.
User is able to send this parameter in a requested url, for example when user requests to `/users/147` 
"147" is an `id` parameter value. To get this value in your controller action you can do it this way:

```typescript
import {JsonController, Get, Req} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users/:id")
    one(@Req() request: Request) {
        const id = request.params.id;
        // do something with id...
    }
    
}
```

Or you can do it simplified way by using `@Param` decorator:

```typescript
import {JsonController, Get, Param} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users/:id")
    one(@Param("id") id: number) {
        // do something with id...
    }
    
}
```

You can use regexp in request parameters.

## Working with query parameters

To get request parameters you need to use `@QueryParam` decorator:

```typescript
import {JsonController, Get, QueryParam} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users")
    all(@QueryParam("limit") limit: number) {
        // get users and limit by a given query parameter
    }
    
}
```

Query parameters are automatically converted into objects if you specify object as a parameter type, for example:

```typescript
// UserFilter.ts
export class UserFilter {
    limit: number;
    offset: number;
}

// UserController.ts
import {JsonController, Get, QueryParam} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users")
    all(@QueryParam("filter") filter: UserFilter) {
        // get filter.limit users and offset by filter.offset
    }
    
}
```

In this example user can send following request: `/users?filter={"limit": 10, "offset": 5}`.

## Getting request body

If you want to save some object sent from the client you can use `@Body` decorator: 

```typescript
import {JsonController, Post, Body} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Post("/users")
    save(@Body() user: User) {
        // now you can save a user
        return getManager().save(user);
    }
    
}
```

It automatically coverts sent user object in json format into the given class instance. 
In this case `user` will be instance of `User` class in the case if `User` is a class.

If you are using non-json controller body will always return you a string.

## Getting request body parameter

If you send an object and don't want to create a separate model for parameters you send
(usually its simple object with parameters) you can extract separate parameters and use them
using `@BodyParam` decorator:

```typescript
import {JsonController, Post, BodyParam} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Post("/users")
    save(@BodyParam("firstName") firstName: string, @BodyParam("lastName") lastName: string) {
        // now you can save a user
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        return getManager().save(user);
    }
    
}
```

## Getting header parameters

To get values from the request headers use `@HeaderParam` decorator:

```typescript
import {JsonController, Get, HeaderParam} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users")
    all(@HeaderParam("authorization") token: string) {
        // do something with user authorization token...
    }
    
}
```

## Getting cookie parameters

To get values from the request cookies use `@CookieParam` decorator:

```typescript
import {JsonController, Get, CookieParam} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users")
    all(@CookieParam("username") username: string) {
        // do something with username...
    }
    
}
```

## Getting session parameters

To get values from the session object use `@SessionParam` decorator:

```typescript
import {JsonController, Get, SessionParam} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Get("/users")
    all(@SessionParam("username") username: string) {
        // do something with username...
    }
    
}
```

## Handling uploaded files

To inject uploaded file, use `@UploadedFile` decorator:

```typescript
import {JsonController, Post, UploadedFile} from "routing-controllers";

@JsonController()
export class FileController {
    
    @Post("/files")
    save(@UploadedFile("filename") file: any) {
        // do something with uploaded file
    }
    
}
```

To handle file uploading routing-controller uses [multer](https://github.com/expressjs/multer) extension. 
Usually you need to customize upload by specifying multer options. You can do it this way: 

```typescript
// to keep code clean extract this function into separate file
// fileUploadOptions.ts

import * as multer from "multer";
export const fileUploadOptions = () => {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // ...
        },
        filename: (req, file, cb) => {
            // ...
        }
    }),
    fileFilter: (req, file, cb) => {
        // ...
    },
    limits: {
        fieldNameSize: 255,
        fileSize: 1024 * 1024 * 2
    }
};

// FileController.ts
import {JsonController, Post, UploadedFile} from "routing-controllers";

@JsonController()
export class FileController {
    
    @Post("/files")
    save(@UploadedFile("filename", { options: fileUploadOptions }) file: any) {
        // do something with uploaded file
    }
    
}
```

To inject all uploaded files use `@UploadedFiles` decorator instead.

## Required parameters

You can make any parameters required by adding `{ required: true }` in parameter options. 
If client will not send required parameters routing-controllers will throw an exception.

```typescript
import {JsonController, Post, Body, QueryParam} from "routing-controllers";

@JsonController()
export class UserController {
    
    @Post("/users")
    save(@Body({ required: true }) user: User, @QueryParam("token", { required: true }) token: string) {
        // do something with uploaded file
    }
    
}
```
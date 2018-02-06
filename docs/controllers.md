# Controllers

* What is Controller
* Controller example
* Controller actions
* Model-based controllers

## What is Controller

Controller is a core peace of the routing-controllers framework.
In controller you define your application endpoints which serve your users.

There are 3 types of controllers in routing-controllers:

* `Controller` - is a regular controller used to serve regular html or text responses. If you are returning non-json response
or making a server-rendered application that's what you need,
* `JsonController` - is a controller used to serve json responses. 
If you are creating a json api, or rest api, or web api that's what you need.
* `ModelController` - is a special framework-opinionated style of defining your controllers based on models. 
It's an alternative to rest/web api people used to use.

## Controller example

### Html, text and server-side rendered content

Let's create a simple controller:

```typescript
import {Controller, Get} from "routing-controllers";

@Controller()
export class UserController {

    @Get("/users")
    all() {
        return "<html><body>...</body></html>";
    }

}
```

Now when you request `/users` route it will return this html content.
In real world application you most probably will use some templating engine like [Mustache](https://github.com/janl/mustache.js/).
How to setup mustache with routing-controllers you can [read here]().
Your controller will look this way:

```typescript
import {Controller, Get} from "routing-controllers";

@Controller()
export class UserController {

    @Get("/users")
    @Render("users.html")
    all() {
        return {
            users: [{
                id: 1,
                firstName: "Timber",
                lastName: "Saw"
            }, {
                id: 2,
                firstName: "Phantom",
                lastName: "Lancer"
            }]
        };
    }

}
```

In this example our controller will render `users.html` template and send returned variables to the templating engine.

### REST-APIs, Web-APIs and json content

If you want your controllers to return a json objects you must use `JsonController` instead, for example:


```typescript
import {JsonController, Get} from "routing-controllers";

@JsonController()
export class UserController {

    @Get("/users")
    all() {
        return [{
            id: 1,
            firstName: "Timber",
            lastName: "Saw"
        }, {
            id: 2,
            firstName: "Phantom",
            lastName: "Lancer"
        }];
    }

}
```

In this example `/users` will return and JSON response with users being serialized.

## Controller actions

Method defined in your controller which serves some HTTP method is called **controller action**.
There are several decorators you can apply on controller actions:

* `@Get()` - serves `GET` requests on the given route
* `@Post()` - serves `POST` requests on the given route
* `@Put()` - serves `PUT` requests on the given route
* `@Delete()` - serves `DELETE` requests on the given route
* `@Patch()` - serves `PATCH` requests on the given route

```typescript
import {Controller, Get} from "routing-controllers";

@Controller()
export class UserController {

    @Get("/users")
    all() {
        return "Getting all users...";
    }

    @Get("/users/:id")
    one() {
        return "Getting a single user...";
    }

    @Post("/users")
    insert() {
        return "Inserting a new user...";
    }

    @Put("/users/:id")
    update() {
        return "Updating a user...";
    }

    @Patch("/users/:id")
    patch() {
        return "Patching a user...";
    }

}
```

Most of times you'll only need those decorators, but if you want more you can use `@Method("METHOD_NAME")` decorator,
where you can specify any method you want to use.

Read more about [actions here](./actions.md).

## Model-based controllers

Model controllers are special type of controllers format used by routing-controllers.
They allow you to create route-less controllers and work with your backend easily from the frontend using your models.
[Read here]() more about model controllers.
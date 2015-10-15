# Type Controllers

Allows to create controllers classes that handle requests.
Simple wrapper over express.js routing.

## Usage

Simply create a class and put annotations on its methods:

```typescript
import {Request, Response} from "express";
import {Controller, Get, Post, Put, Patch, Delete} from "t-controllers/Annotations";

@Controller()
export class BlogController {

    @Get('/blogs')
    getAll(request: Request, response: Response) {
        // use request and response like you always do with express.js ...
    }

    @Get('/blogs/:id')
    getOne(request: Request, response: Response) {
    }

    @Post('/blogs')
    post(request: Request, response: Response) {
    }

    @Put('/blogs/:id')
    put(request: Request, response: Response) {
    }

    @Patch('/blogs/:id')
    patch(request: Request, response: Response) {
    }

    @Delete('/blogs/:id')
    remove(request: Request, response: Response) {
    }

}

// and you need to require controllers and register actions in express app:

import {defaultActionRegistry} from "t-controllers/ActionRegistry";

require('./BlogController'); // require your controller
let app = express(); // create express application
app.use(bodyParser.json()); // setup body parser
defaultActionRegistry.registerActions(app); // register actions in the app
app.listen(3000); // run express app
```

If you want to include the directory with controllers do this:

```typescript
import {defaultActionRegistry} from "t-controllers/ActionRegistry";
import {ControllerUtils} from "t-controllers/ControllerUtils";

ControllerUtils.requireAll([__dirname + '/controllers']); // includes all controllers
let app = express(); // create express application
app.use(bodyParser.json()); // setup body parser
defaultActionRegistry.registerActions(app); // register actions in the app
app.listen(3000); // run express app
```

You can also return result right from the controller, and this result will be pushed via response.send()

```typescript

@Get('/blogs')
getAll(request: Request, response: Response) {
    return [
        { id: 1, name: 'first blog' },
        { id: 2, name: 'second blog' }
    ];
}

// its the same as:
// request.send([{ id: 1, name: 'first blog' }, { id: 2, name: 'second blog' }]);

```

You can also return a Promise (object that contains .then method), and its result will be pushed to response.send after
promise is resolved.

```typescript

@Get('/blogs')
getAll(request: Request, response: Response) {
    return SomeService.loadData();
}

// its the same as SomeService.loadData().then(
//     result => request.send(result),
//     error  => { request.status(500); request.send(error) }
// );

```

You can inject some common express params you may need right into the controller action method:

```typescript

@Get('/blogs/:id')
getAll( request: Request,
        response: Response,
        @Body() requestBody: any,
        @Param('id') id: number,
        @QueryParam('name') name: string) {
    // now you can use your parameters
}

// its the same as: 
// let requestBody = response.body;
// let id = response.params.id;
// let name = response.query.name; 

```

Take a look on samples in `./sample` for more examples of usages.

## Todos

* cover with tests
* integration with other frameworks (other then express.js) can be easily added, so PRs are welcomed

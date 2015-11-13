# Controllers.ts

Allows to create controllers classes that handle requests.
Simple wrapper over express.js routing.

## Usage

Simply create a class and put annotations on its methods:

```typescript
import {Request, Response} from "express";
import {Controller, Get, Post, Put, Patch, Delete, Req, Res} from "controllers.ts/Annotations";

@Controller()
export class BlogController {

    @Get('/blogs')
    getAll(@Req() request: Request, @Res() response: Response) {
        // use request and response like you always do with express.js ...
    }

    @Get('/blogs/:id')
    getOne(@Req() request: Request, @Res() response: Response) {
    }

    @Post('/blogs')
    post(@Req() request: Request, @Res() response: Response) {
    }

    @Put('/blogs/:id')
    put(@Req() request: Request, @Res() response: Response) {
    }

    @Patch('/blogs/:id')
    patch(@Req() request: Request, @Res() response: Response) {
    }

    @Delete('/blogs/:id')
    remove(@Req() request: Request, @Res() response: Response) {
    }

}

// and you need to require controllers and register actions in express app:

import {ControllerRunner} from "controllers.ts/ControllerRunner";
import {ExpressHttpFramework} from "controllers.ts/http-framework-integration/ExpressHttpFramework";

require('./BlogController'); // require your controller
let app = express(); // create express application
app.use(bodyParser.json()); // setup body parser
let controllerRunner = new ControllerRunner(new ExpressHttpFramework(app));
controllerRunner.registerAllActions(); // register actions in the app
app.listen(3000); // run express app
```

If you want to include the directory with controllers do this:

```typescript
import {ControllerRunner} from "controllers.ts/ControllerRunner";
import {ExpressHttpFramework} from "controllers.ts/http-framework-integration/ExpressHttpFramework";

// we use require-all module to load all files from the given directory (do `npm install require-all` in order to use it)
require('require-all')({ dirname: __dirname + '/controllers' });

let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser

let controllerRunner = new ControllerRunner(new ExpressHttpFramework(app));
controllerRunner.registerAllActions(); // register actions in the app
app.listen(3000); // run express app
```

You can also return result right from the controller, and this result will be pushed via response.send()

```typescript

@Get('/blogs')
getAll() {
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
getAll(@Req() request: Request, @Res() response: Response) {
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
getAll( @Req() request: Request,
        @Res() response: Response,
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

# routing-controllers

[![Build Status](https://travis-ci.org/typestack/routing-controllers.svg?branch=master)](https://travis-ci.org/typestack/routing-controllers)
[![codecov](https://codecov.io/gh/typestack/routing-controllers/branch/master/graph/badge.svg)](https://codecov.io/gh/typestack/routing-controllers)
[![npm version](https://badge.fury.io/js/routing-controllers.svg)](https://badge.fury.io/js/routing-controllers)
[![Dependency Status](https://david-dm.org/typestack/routing-controllers.svg)](https://david-dm.org/typestack/routing-controllers)
[![Join the chat at https://gitter.im/typestack/routing-controllers](https://badges.gitter.im/typestack/routing-controllers.svg)](https://gitter.im/typestack/routing-controllers?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<center>
<a href="https://github.com/typestack/routing-controllers#routing-controllers">English</a> | 
<span>中文</span>
</center>

使用包含请求处理行为的函数类创建控制器。
可以在 [express.js][1] 或 [koa.js][2] 中使用 routing-controllers。

# 目录

- [安装](#安装)
- [快速使用](#快速使用)
- [更多用法](#更多用法)
  - [使用 JSON](#使用-JSON)
  - [返回 Promise](#返回-Promise)
  - [使用 Request 和 Response 对象](#使用-Request-和-Response-对象)
  - [预配置 express / Koa](#预配置-express-/-Koa)
  - [从目录加载控制器](#从目录加载控制器)
  - [全局路由前缀](#全局路由前缀)
  - [指定控制器路由前缀](#指定控制器路由前缀)
  - [注入 param 参数](#注入-param-参数)
  - [注入 query 参数](#注入-query-参数)
  - [注入请求 Body](#注入请求-Body)
  - [注入请求 Body 参数](#注入请求-Body-参数)
  - [注入请求 Header 参数](#注入请求-Header-参数)
  - [注入 Cookie 参数](#注入-Cookie-参数)
  - [注入 Session 对象](#注入-Session-对象)
  - [注入 state 对象](#注入-State-对象)
  - [注入上传文件](#注入上传文件)
  - [限制必填参数](#限制必填参数)
  - [参数转为对象](#参数转为对象)
  - [设置 ContentType](#设置-ContentType)
  - [设置 Location](#设置-Location)
  - [设置重定向](#设置重定向)
  - [设置 HTTP 响应代码](#设置-HTTP-响应代码)
  - [管理空响应](#管理空响应)
  - [自定义 Header](#自定义-Header)
  - [模板渲染](#模板渲染)
  - [抛出 HTTP 错误](#抛出-HTTP-错误)
  - [允许跨域](#允许跨域)
  - [默认设置](#默认设置)
- [使用中间件](#使用中间件)
  - [使用已有中间件](#使用已有中间件)
  - [自行实现 express 中间件](#自行实现-express-中间件)
  - [自行实现 Koa 中间件](#自行实现-Koa-中间件)
  - [全局中间件](#全局中间件)
  - [错误处理程序](#错误处理程序)
  - [从目录加载中间件，拦截器和控制器](#从目录加载中间件，拦截器和控制器)
- [使用拦截器](#拦截器)
  - [函数式拦截器](#函数式拦截器)
  - [class 式拦截器](#class-式拦截器)
  - [全局拦截器](#全局拦截器)
- [实例化参数](#实例化参数)
- [参数自动校验](#参数自动校验)
- [使用权限管理](#使用权限管理)
  - [@Authorized 装饰器](#@Authorized-装饰器)
  - [@CurrentUser 装饰器](#@CurrentUser-装饰器)
- [使用 DI 容器](#使用-DI-容器)
- [自定义参数装饰器](#自定义参数装饰器)
- [装饰器参考](#装饰器参考)
  - [控制器装饰器](#控制器装饰器)
  - [控制器函数装饰器](#控制器函数装饰器)
  - [函数参数装饰器](#函数参数装饰器)
  - [中间件和拦截器装饰器](#中间件和拦截器装饰器)
  - [其它装饰器](#其它装饰器)
- [示例](#示例)
- [发行说明](#发行说明)

## 安装

1. 安装模块：

   `npm install routing-controllers`

2. 必要库 `reflect-metadata`：

   `npm install reflect-metadata`

   并确认在使用 routing-controllers 前引入

   ```typescript
   import 'reflect-metadata';
   ```

3. 安装框架：

   **a. 在 _express.js_ 中使用 routing-controllers，需要安装以下依赖：**

   `npm install express body-parser multer`

   可选装它们的类型声明：

   `npm install -D @types/express @types/body-parser @types/multer`

   **b. 在 _koa 2_ 中使用 routing-controllers，需要安装以下依赖：**

   `npm install koa koa-router koa-bodyparser koa-multer`

   可选装它们的类型声明：

   `npm install -D @types/koa @types/koa-router @types/koa-bodyparser`

4. 可选依赖

   `npm install class-transformer class-validator`

   在旧版本中，这些都是直接依赖，但现在它们都是对等依赖关系，因此你可以选择何时更新和允许重大更新。

5. `tsconfig.json` 中需要设置以下配置项：

   ```json
   {
     "emitDecoratorMetadata": true,
     "experimentalDecorators": true
   }
   ```

## 快速使用

1. 新建文件 `UserController.ts`

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

   该类将在服务框架（express.js 或 Koa）中注册被装饰的函数对应的路由。

2. 新建文件 `app.ts`

   ```typescript
   import 'reflect-metadata'; // 引入必要库
   import { createExpressServer } from 'routing-controllers';
   import { UserController } from './UserController';

   // 创建express应用，注册所有控制器路由并返回express实例
   const app = createExpressServer({
     controllers: [UserController], //声明需要使用的控制器
   });

   // 在3000端口运行express应用
   app.listen(3000);
   ```

   > koa 用户需替换 `createExpressServer` 为 `createKoaServer`

3. 访问 `http://localhost:3000/users`。浏览器将显示 `This action returns all users`。访问 `http://localhost:3000/users/1` 将显示 `This action returns user #1`。

## 更多用例

#### 使用 JSON

对于一个总是返回 JSON 的 REST API，建议用 `@JsonController` 代替 `@Controller`。
`@JsonController` 装饰的控制器路由的响应数据将自动转换为 JSON 类型且 `Content-Type` 被设置为 `application/json`。
同时请求的 `application/json` 头信息也可以被解释，请求 Body 将解析为 JSON：

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

  @Post('users')
  post(@Body() user: User) {
    return userRepository.insert(user);
  }
}
```

#### 返回 Promise

返回一个 Promise，响应将等待该 Promise 回执后返回其结果。

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

#### 使用 Request 和 Response 对象

直接使用框架的 Request 对象和 Response 对象。
如果想自己处理响应，可以在方法中返回该 Response 对象。

```typescript
import { Controller, Req, Res, Get } from 'routing-controllers';

@Controller()
export class UserController {
  @Get('/users')
  getAll(@Req() request: any, @Res() response: any) {
    return response.send('Hello response!');
  }
}
```

`@Req()` 装饰器注入了一个 `Request` 对象，`@Res()` 装饰器注入了一个 `Response` 对象。
如果安装了对应的类型声明，也可以对它们进行声明：

```typescript
import { Request, Response } from 'express';
import { Controllser, Req, Res, Get } from 'routing-controllers';

@Controller()
export class UserController {
  @Get('/users')
  getAll(@Req() request: Request, @Res() response: Response) {
    return response.send('Hello response!');
  }
}
```

> 提示：koa 用户可以用 `@Ctx() context` 注入 Koa 的 Context 对象。

#### 预配置 express / Koa

需要自行创建 express 应用并单独配置，可以用 `useExpressServer` 代替 `createExpressServer`：

```typescript
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';

let express = require('express'); // 或者引入类型声明
let app = express(); // 已创建的express服务
// app.use() // 配置express
useExpressServer(app, {
  // 在routing-controllers注册已创建的express服务
  controllers: [UserController], // 配置(控制器，校验器等)
});
app.listen(3000); // 运行express服务
```

> koa 用户需用 `useKoaServer` 代替 `useExpressServer`

#### 从目录加载控制器

在 `createExpressServer` 或 `useExpressServer` 中指定文件夹，即可加载该目录下所有控制器：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';

createExpressServer({
  controllers: [__dirname + '/controllers/*.js'],
}).listen(3000); // 在express应用中注册控制器路由
```

> koa 用户需用 `createKoaServer` 代替 `createExpressServer`

#### 全局路由前缀

要为所有路由添加前缀，比如 `/api`，可以使用 `routePrefix` 配置项：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController';

createExpressServer({
  routePrefix: '/api',
  controllers: [UserController],
}).listen(3000);
```

> koa 用户需用 `createKoaServer` 代替 `createExpressServer`

#### 指定控制器路由前缀

向控制器装饰器传递根路由参数，控制器下的路由将添加该跟路由前缀：

```typescript
@Controller('/users')
export class UserController {
  // ...
}
```

#### 注入 param 参数

用 `@Param` 装饰器注入 param 参数：

```typescript
@Get("/users/:id")
getOne(@Param("id") id: number) { // 由于id被声明为number,将自动抛出"number"类型
}
```

`@Params()` 装饰器可以注入所有 param 参数。

#### 注入 query 参数

用 `@QueryParam` 装饰器注入 query 参数：

```typescript
@Get("/users")
getUsers(@QueryParam("limit") limit: number) {
}
```

`@QueryParams()` 装饰器可以注入所有 query 参数。
建议为这些参数执行校验。

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
getUsers(@QueryParams() query: GetUserQuery) {
    // 这里可以访问query.role,query.limit
    // 以及其它已校验的query参数
}
```

#### 注入请求 Body

用 `@Body` 装饰器注入请求 Body：

```typescript
@Post("/users")
saveUser(@Body() user: User) {
}
```

如果对 `@Body()` 装饰的参数声明了类的类型，
routing-controllers 将使用 [class-transformer][4] 去实例化请求 Body 的数据。
在创建服务时配置 `{ classTransformer: false }` 可以禁用该行为。

#### 注入请求 Body 参数

用 `@BodyParam` 装饰器注入请求 Body 参数：

```typescript
@Post("/users")
saveUser(@BodyParam("name") userName: string) {
}
```

#### 注入请求 Header 参数

用 `@HeaderParam` 装饰器注入请求 Header 参数：

```typescript
@Post("/users")
saveUser(@HeaderParam("authorization") token: string) {
}
```

可以使用 `@HeaderParams()` 装饰器注入所有请求 Header 参数。

#### 注入 Cookie 参数

用 `@CookieParam` 装饰器注入 Cookie 参数：

```typescript
@Get("/users")
getUsers(@CookieParam("username") username: string) {
}
```

可以使用 `@CookieParams()` 装饰器注入所有 Cookie 参数。

#### 注入 Session 对象

用 `@SessionParam` 注入一个 Session 值：

```typescript
@Get("/login")
savePost(@SessionParam("user") user: User, @Body() post: Post) {}
```

可以使用无参数的 `@Session()` 装饰器注入 Session 主体。

```typescript
@Get("/login")
savePost(@Session() session: any, @Body() post: Post) {}
```

被 `@Session` 装饰器装饰的参数默认为必填。如果你的方法中该参数是可选的，需要手动标记为非必填：

```typescript
action(@Session("user", { required: false }) user: User){}
```

Express 使用 [express-session][5] / Koa 使用 [koa-session][6] 或 [koa-generic-session][7] 处理 Session，因此必须先安装这些模块才能使用 `@Session` 装饰器。

#### 注入 state 对象

用 `@State` 装饰器注入 state 参数：

```typescript
@Get("/login")
savePost(@State("user") user: User, @Body() post: Post){
}
```

要注入整个 state 对象可以使用无参数的 `@State()`。
state 功能只被 Koa 支持。

#### 注入上传文件

用 `@UploadedFile` 装饰器注入上传的文件：

```typescript
@Post("/files")
saveFile(@UploadFile("fileName") file: any) {
}
```

也可以指定 multer 上传配置：

```typescript
// 为保持代码整洁，最好将该函数抽离到单独的文件中
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

// 进行配置
@Post("/files")
saveFile(@UploadedFile("fileName", { options: fileUploadOptions }) file: any) {
}
```

可以使用 `@UploadFiles` 装饰器注入所有上传的文件。
Routing-controllers 使用 [multer][3] 处理文件上传。
如果安装了 multers 的文件定义声明，可用 `files: File[]` 类型声明代替 `any[]`。

#### 限制必填参数

在装饰器配置 `required: true` 限制参数为必填：

```typescript
@Post("/users")
save(@Body({ required: true }) user: any) {
    // 如果请求内没有user参数，该方法不会执行
}
```

可以在其它任何参数装饰器中限制必填参数，如 `@QueryParam`, `@BodyParam` 等。
如果请求中没有必填参数，routing-controllers 将抛出一个错误。

#### 参数转为对象

如果对被装饰的参数声明了类的类型，
routing-controllers 将使用 [class-transformer][4] 实例化该参数。
[点击这里](#实例化参数)了解更多。

#### 设置 ContentType

为路由设置 ContentType：

```typescript
@Get("/users")
@ContentType("text/cvs")
getUsers() {
    // ...
}
```

#### 设置 Location

为路由设置 Location：

```typescript
@Get("/users")
@Location("http://github.com")
getUsers() {
    // ...
}
```

#### 设置重定向

为路由设置重定向：

```typescript
@Get("/users")
@Redirect("http://github.com")
getUsers() {
    // ...
}
```

通过返回字符串覆写重定向地址：

```typescript
@Get("/users")
@Redirect("http://github.com")
getUsers() {
    return "https://www.google.com";
}
```

使用模板生成重定向：

```typescript
@Get("/users")
@Redirect("http://github.com/:owner/:repo")
getUsers() {
    return {
        owner: "pleerock",
        repo: "routing-controllers"
    };
}
```

#### 设置 HTTP 响应代码

可以显式设置 HTTP 响应代码：

```typescript
@HttpCode(201)
@Post("/users")
saveUser(@Body() user: User) {
    // ...
}
```

#### 管理空响应

对于返回 `void` 或 `Promise<void>` 或 `undefined` 的控制器方法，将自动向客户端抛出 404 错误。
`@OnUndefined` 装饰器可用于设置这种情况下的状态码。

```typescript
@Delete("/users/:id")
@OnUndefined(204)
async remove(@Param("id") id: number): Promise<void> {
    return userRepository.removeById(id);
}
```

对于返回值可能为 undefined 的情况，`@OnUndefined` 也可以发挥作用。
下面例子中，当用户 id 不存在时 `findOneById` 返回 undefined，该路由将返回 404 代码，如果存在则返回 200 代码：

```typescript
@Get("/users/:id")
@OnUndefined(404)
getOne(@Param("id") id: number) {
    return userRepository.findOneById(id);
}
```

当结果为 undefined 时也可以返回一个错误类：

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
    return userRespository.findOneById(id);
}
```

如果控制器方法返回 `null` 可以用 `@OnNull` 装饰器替代。

#### 自定义 Header

定义任意 Header 信息：

```typescript
@Get("/users/:id")
@Header("Catch-Control", "none")
getOne(@Param("id") id: number){
    // ...
}
```

#### 模板渲染

通过服务端渲染功能渲染任意模板：

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

服务端渲染功能需要正确配置 express / Koa。
Koa 用户应使用第三方渲染工具如 [koa-views](https://github.com/queckezz/koa-views/)，
koa-views 是唯一经过测试的渲染中间件。

#### 抛出 HTTP 错误

返回指定错误：

```typescript
@Get("/users/:id")
getOne(@Param("id") id: number) {

    const user = this.userRepository.findOneById(id);
    if(!user)
        throw new NotFoundError(`User was not found.`); // 参数选填

    return user;
}
```

当请求中的 id 未查询到用户，将返回以下 404 响应：

```json
{
  "name": "NotFoundError",
  "message": "User was not found."
}
```

预置错误列表：

- HttpError
- BadRequestError
- ForbiddenError
- InternalServerError
- MethodNotAllowedError
- NotAcceptableError
- NotFoundError
- UnauthorizedError

可以继承 `HttpError` 类自行创建使用 error。
也可实现一个 toJson 函数定义返回给客户端的数据。

```typescript
class DbError extends HttpError {
  public operationName: string;
  public args: any[];

  constructor(operationName: string, args: any[] = []) {
    super(500);
    Object.setPrototypeOf(this, DbError.prototype);
    this.operationName = operationName;
    this.args = args; // 可用于内部log记录
  }

  toJson() {
    return {
      status: this.httpCode,
      failedOperation: this.operationName,
    };
  }
}
```

#### 允许跨域

跨域是目前大部分 web-api 应用使用的特性，配置 routing-controllers 允许跨域：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';

const app = createExpressServer({
  cors: true,
  controllers: [UserController],
});

app.listen(3000);
```

使用 cors 需要先安装对应模块。
express 用户需要 `npm i cors`，Koa 用户需要 `npm i kcors`。
可以如下例进行配置：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';

const app = createExpressServer({
  cors: {
    // cors相关配置
  },
  controllers: [UserController],
});

app.listen(3000);
```

#### 默认设置

在 routing-controllers 配置中覆写默认状态码。

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';

const app = createExpressServer({
  defaults: {
    // 返回null时的默认状态码为404
    nullResultCode: 404,

    // 返回viod或Promise<void>时的默认状态码为204
    undefinedResultCode: 204,

    paramOptions: {
      // 参数默认为必填
      required: true,
    },
  },
});

app.listen(3000);
```

## 使用中间件

`@Middleware` 装饰器用于自定义中间件，
`@UseBefore` 和 `@UseAfter` 装饰器使用任何已有的或自定义的 express / Koa 中间件。

### 使用已有中间件

有多个方式使用中间件，以 [compression](https://github.com/expressjs/compression) 为例：

1. 安装 compression 中间件：`npm install compression`
2. 在方法中使用中间件：

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

   通过这种方式，compression 中间件将只应用于 `getOne` 方法，并在路由方法执行 _前_ 执行，要在方法执行 _后_ 执行中间件，应使用 `@UseAfter`。

3. 在控制器中使用中间件：

   ```typescript
   import { Controller, UseBefore } from 'routing-controllers';
   let compression = require('compression');

   @Controller()
   @UseBefore(compression())
   export class UserController {}
   ```

   使用这种方式，compression 中间件将应用于 `UserController` 控制器下所有方法，且在方法执行前执行。同样可以使用 `@UseAfter` 装饰器在方法执行后应用中间件。

4. 要全局使用 compression 模块，可以在服务引导时注册中间件：

   ```typescript
   import 'reflect-metadata';
   import { createExpressServer } from 'routing-controllers';
   import { UserController } from './UserController';
   // 必须在调用createExpressServer前加载控制器
   let compression = require('compression');
   let app = createExpressServer({
     controllers: [UserController],
   }); // 创建express应用，注册所有控制器路由并返回express实例
   app.use(compression());
   app.listen(3000); // 运行express应用
   ```

   或者，自定义一个[全局中间件](#全局中间件)，代理执行 compression 模块。

### 自行实现 express 中间件

实现 express.js 中间件：

1. 两种方式：

   第一种，声明一个简单的中间件函数：

   ```typescript
   export function loggingMiddleware(request: any, response: any, next?: (err?: any) => any): any {
     console.log('do something...');
     next();
   }
   ```

   第二种，创建一个类：

   ```typescript
   import { ExpressMiddlewareInterface } from 'routing-controllers';

   export class MyMiddleware implements ExpressMiddlewareInterface {
     // 接口声明可选

     use(request: any, response: any, next?: (err?: any) => any): any {
       console.log('do something...');
       next();
     }
   }
   ```

2. 应用：

   ```typescript
   import { Controller, UseBefore } from 'routing-controllers';
   import { MyMiddleware } from './MyMiddleware';
   import { loggingMiddleware } from './loggingMiddleware';

   @Controller()
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   export class UserController {}
   ```

   或者在路由中应用：

   ```typescript
   @Get("/users/:id")
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   getOne(@Param("id") id: number) {
       // ...
   }
   ```

   `@UseBefore` 在路由每次执行前执行。
   `@UseAfter` 在路由每次执行后执行。

### 自行实现 Koa 中间件

实现 koa.js 的中间件：

1. 两种方式：

   第一种，声明一个简单的中间件函数：

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

   第二种，声明一个类：


    ```typescript
    import { KoaMiddlewareInterface } from "routing-controllers";

    export class MyMiddleware implements KoaMiddlewareInterface { // 接口声明可选

        use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
            console.log("do something before execution...");
            return next().then(() => {
                console.log("do something after execution");
            }).catch(error => {
                console.log("error handling is also here");
            });
        }

    }
    ```

2. 应用：

   ```typescript
   import { Controller, UseBefore } from 'routing-controllers';
   import { MyMiddleware } from './MyMiddleware';
   import { loggingMiddleware } from './loggingMiddleware';

   @Controller()
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   export class UserController {}
   ```

   或者在路由中应用：

   ```typescript
   @Get("/users/:id")
   @UseBefore(MyMiddleware)
   @UseAfter(loggingMiddleware)
   getOne(@Param("id") id: number) {
       // ...
   }
   ```

   `@UseBefore` 在路由每次执行前执行。
   `@UseAfter` 在路由每次执行后执行。

### 全局中间件

全局中间件在所有请求之前执行，
用 `@Middleware` 装饰器创建全局中间件并声明该中间件是在控制器方法之前还是之后执行。

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

必须在 routing-controllers 初始化时指定要使用的全局中间件：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './UserController';
import { LoggingMiddleware } from './LoggingMiddleware';

createExpressServer({
  controllers: [UserController],
  middlewares: [LoggingMiddleware],
}).listen(3000);
```

### 错误处理程序

错误处理程序只能在 express 中使用，
错误处理程序工作方式与中间件相同，但接口声明为 `ExpressErrorMiddlewareInterface`;

1. 创建一个类并声明接口为 `ErrorMiddlewareInterface`：

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

自定义的错误处理程序在默认错误处理后被调用，因此不能修改响应码或 Headers。
要阻止该行为，需要在 createExpressServer 或 useExpressServer 中配置 `defaultErrorHandler` 选项禁用默认错误处理。

```typescript
createExpressServer({
  defaultErrorHandler: false, // 有自己的错误处理程序再禁用默认错误处理
}).listen(3000);
```

### 从目录加载中间件，拦截器和控制器

从文件夹加载中间件。可以使用 glob patterns 匹配模式：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
createExpressServer({
  controllers: [__dirname + '/controllers/**/*.js'],
  middlewares: [__dirname + '/middlewares/**/*.js'],
  interceptors: [__dirname + '/interceptors/**/*.js'],
}).listen(3000);
```

## 使用拦截器

拦截器用于修改或替换返回给客户端的数据。
可以定义全局拦截器，也能为指定控制器或路由定义拦截器。
拦截器工作原理与中间件相似。

### 函数式拦截器

最简单的方式是通过 `@UseInterceptor` 直接用函数实现拦截器。

```typescript
import { Get, Param, UseInterceptor } from "routing-controllers";

// ...

@Get("/users")
@UseInterceptor(function(action: Action, content: any) {
    // 这里有路由返回的原始内容。
    // 可以进行修改并返回一个替换后的结果，该结果将作为响应返回给用户
    return content.replace(/Mike/gi, "Michael");
})
getOne(@Param("id") id: number) {
    return "Hello, I am Mike!"; // 用户将接收到”Hello, I am Michael;“响应。
}
```

也可以在控制器中使用 `@UseInterceptor` 装饰器。
当用于控制器时，拦截器将作用于该控制器下所有路由。

### class 式拦截器

可以声明一个拦截器类并通过 `@UseInterceptor` 装饰器应用：

```typescript
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

export class NameCorrectionInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    return content.replace(/Mike/gi, 'Michael');
  }
}
```

通过以下方式在控制器应用：

```typescript
import { Get, Param, UseInterceptor } from "routing-controllers";
import { NameCorrectionInterceptor } from "./NameCorrectionInterceptor";

// ...

@Get("/users")
@UseInterceptor(NameCorrectionInterceptor)
getOne(@Param("id") id: number) {
    return "Hello, I am Mike!"; // 用户将接收到"Hello, I am Michael!"响应。
}
```

### 全局拦截器

创建一个拦截器类并用 `@Interceptor` 装饰来实现一个影响所有控制器的全局拦截器：

```typescript
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

@Interceptor()
export class NameCorrectionInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    return content.replace(/Mike/gi, 'Michale');
  }
}
```

## 实例化参数

有时候需要将用户发送的 JSON 对象解析为特定的类而不是简单的字面对象。
可以用 [class-transformer][4] 实现。
需要在服务引导时配置 `classTransformer: true` 开启该功能：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';

createExpressServer({
  classTransformer: true,
}).listen(3000);
```

现在，当解析参数时，如果对其声明了一个类的类型，routing-controllers 将根据用户发送的数据创建一个实例：

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

如果 `User` 是一个接口，只会创建一个简单字面对象。
如果是一个类，将创建该类的实例。

该功能默认开启，作用于 `@Body`， `@Param`， `@QueryParam`， `@BodyParam` 以及其它装饰器上。
可以在 createExpressServer 函数中设置 `classTransformer: false` 来关闭这个功能。

学习 class-transformer 和如何处理更复杂的对象结构[戳这里][4]。

## 参数自动校验

有时候不仅需要解析 JSON 对象为类的实例。
比如，`class-transformer` 不会核对属性的类型，因此可能会出现 Typescript 运行时报错。同样你可能需要校验这些对象，如密码是否够长或电子邮件格式是否正确。

感谢 [class-validator][9] 我们可以轻松实现这一需求。该功能默认 _开启_。如果要关闭，在应用引导时配置 `validation: false`：

```typescript
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';

createExpressServer({
  validation: false,
}).listen(3000);
```

在部分参数中启用，可以在对应装饰器中配置 `validate: true`：

```typescript
@Post("/login")
login(@Body({ validate: true }) user: User) {}
```

现在你需要定义用于声明函数参数的类型的类。
用合适的校验装饰对应的属性。

```typescript
export class User {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

如果没有 class-validator 的使用经验，可以[在这里][9]学习如何使用和处理更复杂的对象校验。

现在，如果指定一个类的类型，你的方法参数将不仅仅是该类的实例(用户发送的数据)，它们同样会被校验，因此你不必担心如邮箱格式错误或密码太短以及其它函数参数校验的问题。

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

如果参数不满足 class-validator 装饰器定义的校验，
将抛出一个错误并被 routing-controllers 捕获，客户端将收到 400 错误和详细的 [Validation errors](https://github.com/pleerock/class-validator#validation-errors) 报错序列。

要专门配置校验（如组别，跳过忽略属性等）或转换（如组别，排除前缀，版本等）。可以用 createExpressServer 中的 `validation` 配置项进行全局配置，或用 `validate` 对函数参数进行单独配置 - `@Body({ validate: localOptions })`。

## 使用权限管理

Routing-controllers 附带两个装饰器实现在应用中的鉴权。

#### `@Authorized` 装饰器

使用 `@Authorized` 装饰器需要配置 routing-controllers：

```typescript
import 'reflect-metadata';
import { createExpressServer, Action } from 'routing-controllers';

createExpressServer({
  authorizationChecker: async (action: Action, roles: string[]) => {
    // 这里可以使用action中的request/response对象
    // 如果装饰器定义了可以访问action角色
    // 也可以使用它们来提供详细的鉴权
    // checker必须返回boolean类型(true or false)或者Promise(回执也必须是boolean)
    // 代码demo：
    const token = action.request.headers['authorization'];

    const user = await getEntityManager().findOneByToken(User, token);
    if (user && !roles.length) return true;
    if (user && roles.find(role => user.roles.indexOf(role) !== -1)) return true;

    return false;
  },
}).listen(3000);
```

在路由中使用 `@Authorized`：

```typescript
@JsonController()
export class SomeController {
  @Authorized()
  @Post('/questions')
  save(@Body() question: Question) {}

  @Authorized('POST_MODERATOR') // 指定角色或角色数组
  @Post('/posts')
  save(@Body() post: Post) {}
}
```

#### `@CurrentUser` 装饰器

使用 `@CurrentUser` 装饰器需要配置 routing-controllers：

```typescript
import 'reflect-metadata';
import { createExpressServer, Action } from 'routing-controllers';

createExpressServer({
  currentUserChecker: async (action: Action) => {
    // 这里可以使用action中的request/response对象
    // 需要提供一个用来注入控制器方法的用户对象
    // 代码demo：
    const token = action.request.headers['authorization'];
    return getEntityManager().findOneByToken(User, token);
  },
}).listen(3000);
```

在控制器方法中使用 `@CurrentUser`：

```typescript
@JsonController()
export class QuestionController {
  @Get('/questions')
  all(@CurrentUser() user?: User, @Body() question: Question) {}

  @Post('/questions')
  save(@CurrentUser({ require: true }) user: User, @Body() post: Post) {}
}
```

如果标记 `@CurrentUser` 为 `required`，当 currentUserChecker 返回空数据时，routing-controllers 将抛出 authorization 必填的错误。

## 使用 DI 容器

`routing-controllers` 支持外部 DI 容器注入服务到控制器，中间件和错误处理程序中。
容器必须在应用引导时配置。
这里展示如何整合 [typedi](https://github.com/pleerock/typedi) 到 routing-controllers：

```typescript
import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

// 重要：必须在所有routing-controllers操作前设置容器。
// 包括引入控制器
useContainer(Container);

//创建和运行服务
createExpressServer({
  controllers: [__dirname + '/controllers/*.js'],
  middlewares: [__dirname + '/middlewares/*.js'],
  interceptors: [__dirname + '/interceptors/*.js'],
}).listen(3000);
```

现在注入服务到控制器：

```typescript
@Controller()
export class UsersController {
  constructor(private userRepository: UserRepository) {}

  // ... 控制器方法
}
```

对于没有暴露 `get(xxx)` 函数的其他 IoC 提供者，可以用 `IocAdapter` 创建一个 IoC 适配器，如下：

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

并通知 Routing Controllers 使用：

```typescript
// 应用启动的某个位置
import { useContainer } from 'routing-controllers';
import { Container } from 'inversify';
import { InversifyAdapter } from './inversify-adapter.ts';

const container = new Container();
const inversifyAdapter = new InversifyAdapter(container);
useContainer(inversifyAdapter);
```

## 自定义参数装饰器

这里简单展示如何定制装饰器 "session user"：

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

在控制器中使用：

```typescript
@JsonController()
export class QuestionController {
  @Post()
  save(@Body() question: Question, @UserFromSession({ required: true }) user: User) {
    // 这里有已鉴权的用户，可以安全的存储问题
    // 如果数据库返回的user为undefined并且入参被设为required"
    // routing-controllers将抛出ParamterRequired错误
  }
}
```

## 装饰器参考

#### 控制器装饰器

| 名称                                 | 例子                                                 | 描述                                                                                                                                                                                                                                                         |
| ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@Controller(baseRoute: string)`     | `@Controller("/users") class SomeController`         | 被装饰的类将注册为控制器，该类下被装饰的函数将注册为路由。baseRoute 将作为该控制器所有路由的前缀。                                                                                                                                                           |
| `@JsonController(baseRoute: string)` | `@JsonController("/users") class SomeJsonController` | 被装饰的类将注册为控制器，该类下被装饰的函数将注册为路由。与 @Controller 不同的是，@JsonController 自动将路由返回结果转换为 JSON 对象（使用 JSON.parse）并设置响应的 content-type 为 application/json 发送到客户端。baseRoute 将作为该控制器所有路由的前缀。 |

#### 控制器函数装饰器

| 名称                                                 | 例子                                   | 描述                                                                                                     | express 方式对比                   |
| ---------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `@Get(route: string\|RegExp)`                        | `@Get("/users") all()`                 | 被装饰的函数将注册一个 GET 类型的请求到给定路由。可以指定响应为 JSON 类型或常规类型。                    | `app.get("/users", all)`           |
| `@Post(route: string\|RegExp)`                       | `@Post("/users") save()`               | 被装饰的函数将注册一个 POST 类型的请求到给定路由。可以指定响应为 JSON 类型或常规类型。                   | `app.post("/users", save)`         |
| `@Put(route: string\|RegExp)`                        | `@Put("/users/:id") update()`          | 被装饰的函数将注册一个 PUT 类型的请求到给定路由。可以指定响应为 JSON 类型或常规类型。                    | `app.put("/users/:id", update)`    |
| `@Patch(route: string\|RegExp)`                      | `@Patch("/users/:id") patch()`         | 被装饰的函数将注册一个 PATCH 类型的请求到给定路由。可以指定响应为 JSON 类型或常规类型。                  | `app.patch("/users/:id", patch)`   |
| `@Delete(route: string\|RegExp)`                     | `@Delete("/users/:id") delete()`       | 被装饰的函数将注册一个 DELETE 类型的请求到给定路由。可以指定响应为 JSON 类型或常规类型。                 | `app.delete("/users/:id", delete)` |
| `@Head(route: string\|RegExp)`                       | `@Head("/users/:id) head()`            | 被装饰的函数将注册一个 HEAD 类型的请求到给定路由。可以指定响应为 JSON 类型或常规类型。                   | `app.head("/users/:id", head)`     |
| `@Method(methodName: string, route: string\|RegExp)` | `@Method("move", "/users/:id") move()` | 被装饰的函数将注册一个 `methodName` 定义的请求类型的请求到给定路由。可以指定响应为 JSON 类型或常规类型。 | `app.move("/users/:id", move)`     |

#### 函数参数装饰器

| 名称                                                 | 例子                                             | 描述                                                         | express 方式对比                   |
| ---------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------- |
| `@Req()`                                             | `getAll(@Req() request: Request)`                | 注入 Request 对象。                                          | `function(request, response)`      |
| `@Res()`                                             | `getAll(@Res() response: Response)`              | 注入 Response 对象。                                         | `function(request, response)`      |
| `@Ctx()`                                             | `getAll(@Ctx() context: Context)`                | 注入 Context 对象（仅限 Koa）。                              | `function(ctx)`（Koa 方式）        |
| `@Param(name: string, options?: ParamOptions)`       | `get(@Param("id") id: number)`                   | 注入一个 param 参数。                                        | `request.params.id`                |
| `@Params()`                                          | `get(@Params() params: any)`                     | 注入所有 param 参数。                                        | `request.params`                   |
| `@QueryParam(name: string, options?: ParamOptions)`  | `get(@QueryParam("id") id: number)`              | 注入一个 query 参数。                                        | `request.query.id`                 |
| `@QueryParams()`                                     | `get(@QueryParams() params: any)`                | 注入所有 query 参数。                                        | `request.query`                    |
| `@HeaderParam(name: string, options?: ParamOptions)` | `get(@HeaderParam("token") token: string)`       | 注入一个请求 Header。                                        | `request.headers.token`            |
| `@HeaderParams()`                                    | `get(@HeaderParams() params: any)`               | 注入所有请求 Header。                                        | `request.headers`                  |
| `@CookieParam(name: string, options?: ParamOptions)` | `get(@CookieParam("username") username: string)` | 注入一个 Cookie 参数。                                       | `request.cookie("username")`       |
| `@CookieParams()`                                    | `get(@CookieParams() params: any)`               | 注入所有 Cookie。                                            | `request.cookies`                  |
| `@Session()`                                         | `get(@Session() session: any)`                   | 注入整个 Session 对象。                                      | `request.session`                  |
| `@SessionParam(name: string)`                        | `get(@SessionParam("user") user: User)`          | 注入一个 Session 的属性。                                    | `request.session.user`             |
| `@State(name?: string)`                              | `get(@State() session: StateType)`               | 注入一个 state 内的对象（或者整个 state）。                  | `ctx.state`（ Koa 方式)            |
| `@Body(options?: BodyOptions)`                       | `post(@Body() body: any)`                        | 注入请求 Body，options 中可以配置解析的中间件。              | `request.body`                     |
| `@BodyParam(name: string, options?: ParamOptions)`   | `post(@BodyParam("name") name: string)`          | 注入一个请求 Body 的参数。                                   | `request.body.name`                |
| `@UploadFile(name: string, options?: UploadOptions)` | `post(@UploadOptions("filename") file: any)`     | 注入一个上传的文件。options 中可以指定底层的上传中间件配置。 | `request.file.file`（使用 multer） |
| `@UploadFiles(name: string, options: UploadOptions)` | `post(@UploadFiles("filename") files: any:[])`   | 注入所有上传的文件。options 中可以指定底层的上传中间件配置。 | `request.files`（使用 multer）     |

#### 中间件和拦截器装饰器

| 名称                                       | 例子                                                   | 描述                                   |
| ------------------------------------------ | ------------------------------------------------------ | -------------------------------------- |
| `@Middleware({ type: "before"\|"after" })` | `@Middleware({ type: "before" }) class SomeMiddleware` | 注册一个全局中间件。                   |
| `@UseBefore()`                             | `@UseBefore(CompressionMiddleware)`                    | 在方法执行前使用指定中间件。           |
| `@UseAfter()`                              | `@UseAfter(CompressionMiddleware)`                     | 在方法执行后使用指定中间件。           |
| `@Interceptor()`                           | `@Interceptor() class SomeInterceptor`                 | 注册一个全局拦截器。                   |
| `@UseInterceptor()`                        | `@UseInterceptor(BadWordsInterceptor)`                 | 拦截控制器或路由的返回结果并进行替换。 |

#### 其它装饰器

| 名称                                                             | 例子                                             | 描述                                                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `@Authorized(roles?: string\|string[])`                          | `@Authorized("SUPER_ADMIN")` get()               | 在被装饰路由中对用户鉴权。`currentUserChecker` 应在 routing-controllers 配置中定义。                     |
| `@CurrentUser(options?: {required?: boolean })`                  | get(@CurrentUser({ required: true }) user: User) | 注入当前已鉴权的用户。`currentUserChecker` 应在 routing-controllers 配置中定义。                         |
| `@Header(headerName: string, headerValue: string)`               | `@Header("Catch-Control", "private")` get()      | 为响应设置任意 Header 信息。                                                                             |
| `@ContentType(contentType: string)`                              | `@ContentType("text/csv")` get()                 | 设置响应 Content-Type。                                                                                  |
| `@Location(url: string)`                                         | `@Location("http://github.com")` get()           | 设置响应 Location。                                                                                      |
| `@Redirect(url: string)`                                         | `@Redirect("http://github.com")` get()           | 设置响应重定向。                                                                                         |
| `@HttpCode(code: number)`                                        | `@HttpCode(201)` post()                          | 设置 HTTP 响应代码。                                                                                     |
| `@OnNull(codeOrError: number\|Error)`                            | `@OnNull(201)`                                   | 设置控制器方法返回 null 时的 HTTP 码或响应报错。                                                         |
| `@OnUndefined(codeOrError: number\|Error)`                       | `@OnUndefined(201)`                              | 设置控制器方法返回 undefined 时的 HTTP 码或响应报错。                                                    |
| `@ResponseClassTransformOptions(options: ClassTransformOptions)` | `@ResponseClassTransformOptions(/*...*/)` get()  | 当使用 class-transformer 的 [ClassToPlain](4) 转换响应结果时，该装饰器用于传递配置给 class-transformer。 |
| `@Render(template: string)`                                      | `@Render("user-list.html")` get()                | 渲染给定 html 模板。控制器返回的数据将作为模板变量。                                                     |

## 示例

- [express 中使用 routing-controllers](https://github.com/pleerock/routing-controllers-express-demo)
- [Koa 中使用 routing-controllers](https://github.com/pleerock/routing-controllers-koa-demo)
- [angular2 中使用 routing-controllers](https://github.com/pleerock/routing-controllers-angular2-demo)
- [node 微服务中使用 routing-controllers](https://github.com/swimlane/node-microservice-demo)
- [功能用法示例](https://github.com/pleerock/routing-controllers/tree/master/sample)

## 发行说明

[点击这里](../../CHANGELOG.md)查看重大修改和发行说明

[1]: http://expressjs.com/
[2]: http://koajs.com/
[3]: https://github.com/expressjs/multer
[4]: https://github.com/pleerock/class-transformer
[5]: https://www.npmjs.com/package/express-session
[6]: https://www.npmjs.com/package/koa-session
[7]: https://www.npmjs.com/package/koa-generic-session
[8]: http://koajs.com/#ctx-state
[9]: https://github.com/pleerock/class-validator

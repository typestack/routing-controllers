# Changelog and release notes

### 0.8.0 [BREAKING CHANGES]

#### Features

- extract generic `@Session()` deocorator into `@SessionParam()` and `@Session()`
- restore/introduce `@QueryParams()` and `@Params()` missing decorators options (ref [#289][#289])
- normalize param object properties (for "queries", "headers", "params" and "cookies"), with this change you can easily validate query/path params using `class-validator` (ref [#289][#289])
- improved params normalization, converting to primitive types is now more strict and can throw ParamNormalizationError (e.g. when number is expected but an invalid string (NaN) has been received) (ref [#289][#289])

### 0.7.8

#### Features

- updated `class-transformer` and `class-validator` to latest.

### 0.7.7

#### Features

- feat(ErrorHandling): add support for custom toJSON method in errors (ref [#325][#325])

#### Fixes

- fixed inconsistent roles parameter in authorizationChecker (ref [#308][#308])

### 0.7.6

#### Fixes

- fixed bugs with undefined result code behaviour

### 0.7.5

#### Fixes

- fixed bugs with undefined result code behaviour

### 0.7.4

#### Fixes

- fixed bugs with undefined result code behaviour

### 0.7.3

#### Features

- Support for returning Buffer and streams from action handler (controller's method) (ref [#285][#285])
- Custom driver support (ref [#276][#276])

#### Fixes

- Directly calling response bug (ref [#286][#286])
- Missing parameter in @BodyParam error message (ref [#284][#284])
- Sync and async auth checker bug (ref (ref [#283][#283])
- Handling different content-type responses in JsonController (ref [#277][#277])

### 0.7.2

#### Fixes

- Using `@Authorization` decorator with Koa caused 404 responses (ref [#240][#240])
- Allow throwing custom errors in `authorizationChecker` (ref [#233][#233])
- check auth permissions before accepting files for upload (ref [#251][#251])

### 0.7.0 [BREAKING CHANGES]

- some routing-controllers options has been changed and renamed
- returned validation error value signature has changed
- controllers and middlewares now can be specified in routing-controllers options
- `MiddlewareInterface` was removed and instead `ExpressMiddlewareInterface` or `KoaMiddlewareInterface` should be used
- `ExpressErrorMiddlewareInterface` was renamed into `ErrorMiddlewareInterface`
- per-controller and per-action middlewares used in `@UseBefore` and `@UseAfter` now should not be marked with `@Middleware` decorator
- `@MiddlewareGlobalBefore()` and `@MiddlewareGlobalAfter()` were removed and instead new signatures should be used: `@Middleware({ type: "before" })` and `@Middleware({ type: "after" })`
- named some decorator parameter names
- added few new decorators to get all parameters like `@QueryParams`, `@Params`, `@HeaderParams` etc.
- added `@Authorized` and `@CurrentUser` decorators
- added new `@Ctx` decorator to use context with koa
- `@NullResultCode` has been renamed to `@OnNull`, now supports error classes
- `@UndefinedResultCode` has been renamed to `@OnUndefined`, now supports error classes
- `@EmptyResultCode` has been removed. Use `@OnUndefined` decorator instead and return concrete types in your controllers.
- added ability to create custom decorators
- enabled validation by default
- multiple bug fixes
- codebase refactoring
- removed `JsonResponse` and `TextResponse` decorators

### 0.6.10

#### Features

- added integration with `class-transform-validator` for deserialization and auto validation request parameters

### 0.6.2

#### Features

- made interceptors to support promises

### 0.6.1

#### Features

- added interceptors support

### 0.6.0 [BREAKING CHANGES]

#### Features

- middleware and error handlers support
- everything packed into "routing-controllers" main export
- added few more new decorators

#### Fixes

- fixed multiple issues with param decorators
- fixed multiple bugs
- refactored core

#### Removals

- removed `parseJson` from `@Body` decorator
- removed `ActionOptions`
- removed `responseType` from action options and added `@JsonResponse` and `@TextResponse` decorators

### 0.5.0

- renamed package from `controllers.ts` to `routing-controllers`
- added integration with `constructor-utils` for serialization and deserialization

[#325]: https://github.com/pleerock/routing-controllers/pull/325
[#308]: https://github.com/pleerock/routing-controllers/pull/308
[#286]: https://github.com/pleerock/routing-controllers/pull/286
[#285]: https://github.com/pleerock/routing-controllers/pull/285
[#284]: https://github.com/pleerock/routing-controllers/pull/284
[#283]: https://github.com/pleerock/routing-controllers/pull/283
[#277]: https://github.com/pleerock/routing-controllers/pull/277
[#276]: https://github.com/pleerock/routing-controllers/pull/276
[#251]: https://github.com/pleerock/routing-controllers/pull/251
[#240]: https://github.com/pleerock/routing-controllers/pull/240
[#233]: https://github.com/pleerock/routing-controllers/pull/233

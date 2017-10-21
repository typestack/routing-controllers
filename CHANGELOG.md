# Changelog and release notes

### 0.8.0

- extract generic `@Session()` deocorator into `@SessionParam()` and `@Session()`
- restore/introduce `@QueryParams()` and `@Params()` missing decorators options (they are needed for validation purposes) - #289
- normalize param object properties (for "queries", "headers", "params" and "cookies") - now you can easily validate query/path params using `class-validator` - #289
- enhance params normalization - converting from string to primitive types is now more strict and can throw ParamNormalizationError,
e.g. when number is expected but the invalid string (NaN) has been received - #289

### 0.7.3

- FIXED: Directly calling response bug - #286
- FIXED: Missing parameter in @BodyParam error message - #284
- FIXED: Sync and async auth checker bug - #283
- FIXED: Handling different content-type responses in JsonController - #277
- ADDED: Support for returning Buffer and streams from action handler (controller's method) - #285
- ADDED: Custom driver support - #276

### 0.7.2

- FIXED: Using `@Authorization` decorator with Koa caused 404 responses (ref [#240](https://github.com/pleerock/routing-controllers/pull/240))
- FIXED: Allow throwing custom errors in `authorizationChecker` (ref [#233](https://github.com/pleerock/routing-controllers/pull/233), ref [#247](https://github.com/pleerock/routing-controllers/pull/247))
- FIXED: check auth permissions before accepting files for upload (ref [#251](https://github.com/pleerock/routing-controllers/pull/240))

### 0.7.1

### 0.7.0 [BREAKING CHANGES]

- some routing-controllers options has been changed and renamed
- returned validation error value signature has changed
- controllers and middlewares now can be specified in routing-controllers options
- `MiddlewareInterface` was removed and instead `ExpressMiddlewareInterface` or `KoaMiddlewareInterface` should be used
- `ExpressErrorMiddlewareInterface` was renamed into `ErrorMiddlewareInterface`
- per-controller and per-action middlewares used in `@UseBefore` and `@UseAfter` now should not be marked with `@Middleware` decorator
- `@MiddlewareGlobalBefore()` and `@MiddlewareGlobalAfter()` were removed and instead new signatures should be used: `@Middleware({ type: "before" })`
and `@Middleware({ type: "after" })`
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

* added integration with `class-transform-validator` for deserialization and auto validation request parameters

### 0.6.2

* made interceptors to support promises

### 0.6.1

- added interceptors support

### 0.6.0 [BREAKING CHANGES]

- middleware and error handlers support
- everything packed into "routing-controllers" main export
- removed parseJson from @Body decorator
- removed ActionOptions
- removed responseType from action options and added @JsonResponse and @TextResponse decorators
- added few more new decorators
- fixed multiple issues with param decorators
- fixed multiple bugs
- refactored core

### 0.5.0

- renamed package from `controllers.ts` to `routing-controllers`
- added integration with `constructor-utils` for serialization and deserialization

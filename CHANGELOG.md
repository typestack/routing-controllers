# Changelog and release notes

## [0.10.2](https://github.com/typestack/routing-controllers/compare/v0.10.1...v0.10.2) (2023-03-06)

### Changed

- `glob` package updated to `8.1.0` from `8.0.3`
- `body-parser` package updated to `1.20.2` from `1.20.1`
- `multer` package updated to `1.4.5-lts.1` from `1.4.4`
  - Note: This fixes vulnerability CVE-2022-24434
- updated various dev dependencies

### Fixed

- Added normalization to glob pattern resolver to fix Windows paths

## [0.10.1](https://github.com/typestack/routing-controllers/compare/v0.10.0...v0.10.1) (2023-01-13)

### Changed

- `class-validator` package updated to `0.14.0` from `0.13.2`
  - Note: class-validator 0.14.0 enables `forbidUnknownValues` by default, but this is overridden in routing-controllers to prevent a breaking change. You can still enable it like before.
- `koa` package updated to `2.14.1` from `2.13.4`
- updated various dev dependencies

## [0.10.0](https://github.com/typestack/routing-controllers/compare/v0.9.0...v0.10.0) (2022-12-9)

### Added

- `isArray` option for `@QueryParam`

### Changed

- `class-transformer` package updated to `0.5.1` from `0.3.1`
- `class-validator` package updated to `0.13.2` from `0.12.2`
- `cookie` package updated to `0.5.0` from `0.4.0`
- `glob` package updated to `8.0.3` from `7.1.4`
- `express` package updated to `4.18.2` from `4.17.1` and moved to `optionalDependencies`
- `express-session` package updated to `1.17.1` from `1.17.3` and moved to `optionalDependencies`
- `body-parser` package updated to `1.20.1` from `1.19.0`
- `multer` package updated to `1.4.4` from `1.4.2`
- `koa` package updated to `2.13.4` from `2.8.2`
- `koa-multer` package replaced with `@koa/multer`
- `koa-router` package replaced with `@koa/router`
- updated various dev dependencies

### Fixed

- Fixed parsing uuid as route parameter
- Fixed `target` property not set during controller inheritance
- Fixed `NaN` check for number route parameters
- Added missing null value handling in parameters
- Fixed middlewares not using the defined route prefix

### 0.9.0

#### Features

- Add support for wildcard "all" routes (ref [#536])
- Controller inheritance - Added missing tests, code samples, and updated documentation (ref [#578][#301])
- Added a useResponseClassTransformer global option (ref [#329])
- Through [#329], it should now be possible to use classTransformer only for input (ref [#179])
- Added support for controller inheritance (ref [#147])
- Update all dependencies and changed it to use npm auto-update patches and minor versions (ex.: "class-validator": "^0.12.2", instead of "class-validator": "0.12.2" (ref [#550])
- Updated project tooling (ref [##618])

#### Fixes

- Input-validation bypass vulnerability (ref [#518])
- Fixed issue that would cause multiple route executions per request (ref [#568])
- Fixed export of SessionParam at index (ref [#526])
- Through [#536], it should now prevent conflicts in routes names (ref [#547])
- Through [#568], it should now prevent a single request triggering multiple route executions that would cause Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client issue. (ref [#491])
- Fixed order of global interceptors (ref [#543])
- Fixed incorrect handling of rejected promises from Middleware.use() (ref [#438])
- Through [#329], it should fix performance issue with big json result (ref [#226])
- Through [#329], it should fix problem with mongoose model serialization (ref [#149])
- Local ValidationOptions are not overwriting global defaults (ref [#618])

#### Documentation

- Added TypeDI service decorator to example in README (ref [#643])
- Translate document to Chinese (ref [#574])
- Fix typo in README (ref [#571])
- Add another example for using the response directly (ref [#546])

### 0.8.0 [BREAKING CHANGES]

- [class-transformer](https://github.com/typestack/class-transformer) and [class-validator](https://github.com/typestack/class-validator) are now peer dependencies.

#### Features

- extract generic `@Session()` deocorator into `@SessionParam()` and `@Session()` (ref [#335][#348][#407])
- restore/introduce `@QueryParams()` and `@Params()` missing decorators options (ref [#289][#289])
- normalize param object properties (for "queries", "headers", "params" and "cookies"), with this change you can easily validate query/path params using `class-validator` (ref [#289][#289])
- improved params normalization, converting to primitive types is now more strict and can throw ParamNormalizationError (e.g. when number is expected but an invalid string (NaN) has been received) (ref [#289][#289])

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
- `ErrorMiddlewareInterface` was renamed to `ExpressErrorMiddlewareInterface`
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

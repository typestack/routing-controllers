# Release notes

**0.6.2**

* made interceptors to support promises

**0.6.1**

* added interceptors support

**0.6.0** *[BREAKING CHANGES]*

* middleware and error handlers support
* everything packed into "routing-controllers" main export
* removed parseJson from @Body decorator
* removed ActionOptions
* removed responseType from action options and added @JsonResponse and @TextResponse decorators
* added few more new decorators
* fixed multiple issues with param decorators
* fixed multiple bugs
* refactored core

**0.5.0**

* renamed package from `controllers.ts` to `routing-controllers`
* added integration with `constructor-utils` for serialization and deserialization

import {ParameterDecoratorInterface} from "./interface/ParameterDecoratorInterface";
import {MetadataArgsStorage} from "./metadata-args/MetadataArgsStorage";
import {TypeStackFramework} from "./TypeStackFramework";
import {TypeStackOptions} from "./TypeStackOptions";

// -------------------------------------------------------------------------
// Main exports
// -------------------------------------------------------------------------

export * from "./decorator/Authorized";
export * from "./decorator/Body";
export * from "./decorator/BodyParam";
export * from "./decorator/ContentType";
export * from "./decorator/Controller";
export * from "./decorator/CookieParam";
export * from "./decorator/CookieParams";
export * from "./decorator/Delete";
export * from "./decorator/Get";
export * from "./decorator/Head";
export * from "./decorator/Header";
export * from "./decorator/HeaderParam";
export * from "./decorator/HeaderParams";
export * from "./decorator/HttpCode";
export * from "./decorator/JsonController";
export * from "./decorator/Location";
export * from "./decorator/Method";
export * from "./decorator/OnNull";
export * from "./decorator/OnUndefined";
export * from "./decorator/Param";
export * from "./decorator/Params";
export * from "./decorator/Patch";
export * from "./decorator/Post";
export * from "./decorator/Put";
export * from "./decorator/QueryParam";
export * from "./decorator/QueryParams";
export * from "./decorator/Redirect";
export * from "./decorator/RequestMap";
export * from "./decorator/Render";
export * from "./decorator/Req";
export * from "./decorator/Res";
export * from "./decorator/ResponseClassTransformOptions";
export * from "./decorator/Session";
export * from "./decorator/UploadedFile";
export * from "./decorator/UploadedFiles";
export * from "./decorator/Use";
export * from "./decorator/Intercept";

export * from "./decorator-options/BodyOptions";
export * from "./decorator-options/ParamOptions";
export * from "./decorator-options/UploadOptions";

export * from "./http-error/HttpError";
export * from "./http-error/InternalServerError";
export * from "./http-error/BadRequestError";
export * from "./http-error/ForbiddenError";
export * from "./http-error/NotAcceptableError";
export * from "./http-error/MethodNotAllowedError";
export * from "./http-error/NotFoundError";
export * from "./http-error/UnauthorizedError";

export * from "./interface/MiddlewareInterface";
export * from "./interface/ErrorMiddlewareInterface";
export * from "./metadata-args/MetadataArgsStorage";
export * from "./metadata/ActionMetadata";
export * from "./metadata/ControllerMetadata";
export * from "./metadata/MiddlewareMetadata";
export * from "./metadata/ParamMetadata";
export * from "./metadata/ResponseHandleMetadata";
export * from "./metadata/UseMetadata";

export * from "./TypeStackOptions";
export * from "./interface/ParameterDecoratorInterface";
export * from "./interface/RoleCheckerInterface";
export * from "./Action";
export * from "./interface/InterceptorInterface";

// -------------------------------------------------------------------------
// Main Functions
// -------------------------------------------------------------------------

/**
 * Gets metadata args storage.
 * Metadata args storage follows the best practices and stores metadata in a global variable.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
    if (!(global as any).routingControllersMetadataArgsStorage)
        (global as any).routingControllersMetadataArgsStorage = new MetadataArgsStorage();

    return (global as any).routingControllersMetadataArgsStorage;
}

/**
 * Registers custom parameter decorator used in the controller actions.
 */
export function createParamDecorator(options: ParameterDecoratorInterface) {
    return function(object: Object, method: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "custom",
            object: object,
            method: method,
            index: index,
            parse: false,
            required: options.required,
            transform: options.value
        });
    };
}

/**
 * Registers all loaded actions in your express application.
 */
export async function bootstrap(options?: TypeStackOptions): Promise<TypeStackFramework> {
    const framework = new TypeStackFramework(options);
    await framework.start();
    return framework;
}
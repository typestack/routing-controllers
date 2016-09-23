import {MetadataArgsStorage} from "./metadata-builder/MetadataArgsStorage";
import {importClassesFromDirectories} from "./util/DirectoryExportedClassesLoader";
import {RoutingControllerExecutor} from "./RoutingControllerExecutor";
import {ExpressDriver} from "./driver/ExpressDriver";
import {KoaDriver} from "./driver/KoaDriver";
import {Driver} from "./driver/Driver";
import {getFromContainer} from "./container";
import {RoutingControllersOptions} from "./RoutingControllersOptions";

// -------------------------------------------------------------------------
// Main Functions
// -------------------------------------------------------------------------

/**
 * Registers all loaded actions in your express application.
 */
export function useExpressServer<T>(expressApp: T, options?: RoutingControllersOptions): T {
    createExecutor(new ExpressDriver(expressApp), options || {});
    return expressApp;
}

/**
 * Registers all loaded actions in your express application.
 */
export function createExpressServer(options?: RoutingControllersOptions): any {
    const driver = new ExpressDriver();
    createExecutor(driver, options || {});
    return driver.express;
}

/**
 * Registers all loaded actions in your koa application.
 */
export function useKoaServer<T>(koaApp: T, options?: RoutingControllersOptions): T {
    createExecutor(new KoaDriver(koaApp), options || {});
    return koaApp;
}

/**
 * Registers all loaded actions in your koa application.
 */
export function createKoaServer(options?: RoutingControllersOptions): any {
    const driver = new KoaDriver();
    createExecutor(driver, options || {});
    return driver.koa;
}

/**
 * Registers all loaded actions in your express application.
 */
function createExecutor(driver: Driver, options: RoutingControllersOptions): void {

    // import all controllers and middlewares and error handlers (new way)
    if (options && options.controllers && options.controllers.length)
        importClassesFromDirectories(options.controllers);
    if (options && options.middlewares && options.middlewares.length)
        importClassesFromDirectories(options.middlewares);
    if (options && options.interceptors && options.interceptors.length)
        importClassesFromDirectories(options.interceptors);

    // import all controllers and middlewares and error handlers (deprecated way)
    if (options && options.controllerDirs && options.controllerDirs.length)
        importClassesFromDirectories(options.controllerDirs);
    if (options && options.middlewareDirs && options.middlewareDirs.length)
        importClassesFromDirectories(options.middlewareDirs);
    if (options && options.interceptorDirs && options.interceptorDirs.length)
        importClassesFromDirectories(options.interceptorDirs);

    if (options && options.developmentMode !== undefined) {
        driver.developmentMode = options.developmentMode;
    } else {
        driver.developmentMode = process.env.NODE_ENV !== "production";
    }

    if (options.defaultErrorHandler !== undefined) {
        driver.isDefaultErrorHandlingEnabled = options.defaultErrorHandler;
    } else {
        driver.isDefaultErrorHandlingEnabled = true;
    }

    if (options.useClassTransformer !== undefined) {
        driver.useClassTransformer = options.useClassTransformer;
    } else {
        driver.useClassTransformer = true;
    }

    driver.classToPlainTransformOptions = options.classToPlainTransformOptions;
    driver.plainToClassTransformOptions = options.plainToClassTransformOptions;

    if (options.errorOverridingMap !== undefined)
        driver.errorOverridingMap = options.errorOverridingMap;

    if (options.routePrefix !== undefined)
        driver.routePrefix = options.routePrefix;

    // next create a controller executor
    new RoutingControllerExecutor(driver)
        .bootstrap()
        .registerMiddlewares(false)
        .registerActions()
        .registerMiddlewares(true); // todo: register only for loaded controllers?
}

// -------------------------------------------------------------------------
// Global Metadata Storage
// -------------------------------------------------------------------------

/**
 * Gets the metadata arguments storage.
 */
export function defaultMetadataArgsStorage(): MetadataArgsStorage {
    return getFromContainer(MetadataArgsStorage);
}

// -------------------------------------------------------------------------
// Commonly Used exports
// -------------------------------------------------------------------------

export * from "./container";
export * from "./decorator/controllers";
export * from "./decorator/decorators";
export * from "./decorator/methods";
export * from "./decorator/params";
export * from "./middleware/MiddlewareInterface";
export * from "./middleware/InterceptorInterface";
export * from "./middleware/ErrorMiddlewareInterface";
export * from "./RoutingControllersOptions";

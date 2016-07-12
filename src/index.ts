import {MetadataArgsStorage} from "./metadata-builder/MetadataArgsStorage";
import {importClassesFromDirectories} from "./util/DirectoryExportedClassesLoader";
import {RoutingControllerExecutor} from "./RoutingControllerExecutor";
import {Driver} from "./Driver";

// -------------------------------------------------------------------------
// Interfaces
// -------------------------------------------------------------------------

/**
 * Routing controller initialization options.
 */
export interface RoutingControllersOptions {

    /**
     * List of directories from where to "require" all your controllers.
     */
    controllerDirs?: string[];

    /**
     * List of directories from where to "require" all your middlewares.
     */
    middlewareDirs?: string[];

    /**
     * List of directories from where to "require" all your error handlers.
     */
    errorHandlerDirs?: string[];

    /**
     * IOC Container to be used to initialize your controllers, middlewares and error handlers.
     */
    container?: { get: (cls: any) => any };

    /**
     * Indicates if constructor-utils should be used to perform serialization / deserialization.
     */
    useConstructorUtils?: boolean;

    /**
     * Indicates if development mode is enabled. By default its enabled if your NODE_ENV is not equal to "production".
     */
    developmentMode?: boolean;

    /**
     * Indicates if default routing-controller's error handler is enabled or not. By default its enabled.
     */
    defaultErrorHandler?: boolean;

    /**
     * Map of error overrides.
     */
    errorOverridingMap?: Object;
    
    /**
     * Route prefix. eg '/api'
     */
    routePrefix?: string;
    
}

// -------------------------------------------------------------------------
// Main Functions
// -------------------------------------------------------------------------

/**
 * Registers all loaded actions in your express application.
 */
export function useServer(expressApp: any, options?: RoutingControllersOptions): void {
    createExecutor(expressApp, options || {});
}

/**
 * Registers all loaded actions in your express application.
 */
export function createServer(options?: RoutingControllersOptions): any {

    let expressApp: any;
    if (require) {
        try {
            expressApp = require("express")();
        } catch (e) {
            throw new Error("express package was not found installed. Try to install it: npm install express --save");
        }
    } else {
        throw new Error("Cannot load express. Try to install all required dependencies.");
    }

    useServer(expressApp, options);
    return expressApp;
}

/**
 * Registers all loaded actions in your express application.
 */
function createExecutor(expressApp: any, options: RoutingControllersOptions): void {

    const driver = new Driver(expressApp);
    
    // first of all setup a container if its specified
    if (options && options.container)
        useContainer(options.container);

    // second import all controllers and middlewares and error handlers
    if (options && options.controllerDirs && options.controllerDirs.length)
        importClassesFromDirectories(options.controllerDirs);
    if (options && options.middlewareDirs && options.middlewareDirs.length)
        importClassesFromDirectories(options.middlewareDirs);
    if (options && options.errorHandlerDirs && options.errorHandlerDirs.length)
        importClassesFromDirectories(options.errorHandlerDirs);

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

    if (options.useConstructorUtils !== undefined) {
        driver.useConstructorUtils = options.useConstructorUtils;
    } else {
        driver.useConstructorUtils = true;
    }

    if (options.errorOverridingMap !== undefined)
        driver.errorOverridingMap = options.errorOverridingMap;

    if (options.routePrefix !== undefined)
        driver.routePrefix = options.routePrefix;

    // next create a controller executor
    new RoutingControllerExecutor(driver)
        .registerPreExecutionMiddlewares()
        .registerActions()
        .registerPostExecutionMiddlewares()
        .registerErrorHandlers(); // todo: register only for loaded controllers?
}

// -------------------------------------------------------------------------
// Global Container
// -------------------------------------------------------------------------

/**
 * Container to be used by this library for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
let container: { get<T>(someClass: { new (...args: any[]): T }|Function): T } = new (class {
    private instances: any[] = [];
    get<T>(someClass: { new (...args: any[]): T }): T {
        if (!this.instances[<any>someClass])
            this.instances[<any>someClass] = new someClass();

        return this.instances[<any>someClass];
    }
})();

/**
 * Sets container to be used by this library.
 *
 * @param iocContainer
 */
export function useContainer(iocContainer: { get(someClass: any): any }) {
    container = iocContainer;
}

/**
 * Gets the IOC container used by this library.
 */
export function getContainer() {
    return container;
}

// -------------------------------------------------------------------------
// Global Metadata Storage
// -------------------------------------------------------------------------

/**
 * Gets the metadata arguments storage.
 */
export function defaultMetadataArgsStorage(): MetadataArgsStorage {
    return container.get(MetadataArgsStorage);
}

// -------------------------------------------------------------------------
// Commonly Used exports
// -------------------------------------------------------------------------

export * from "./decorator/controllers";
export * from "./decorator/decorators";
export * from "./decorator/methods";
export * from "./decorator/params";
export * from "./middleware/MiddlewareInterface";
export * from "./ErrorHandlerInterface";

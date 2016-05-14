import {MetadataArgsStorage} from "./metadata-builder/MetadataArgsStorage";
import {importClassesFromDirectories} from "./util/DirectoryExportedClassesLoader";
import {ExpressServer} from "./server/ExpressServer";
import {ControllerRegistrator} from "./ControllerRegistrator";

// -------------------------------------------------------------------------
// Helper Functions
// -------------------------------------------------------------------------

/**
 * Registers all loaded actions in your express application.
 *
 * @param expressApp Express application instance
 * @param requireDirs Array of directories where from controller files will be loaded
 */
export function registerActionsInExpressApp(expressApp: any, requireDirs?: string[]): ControllerRegistrator {
    const controllerRegistrator = new ControllerRegistrator(new ExpressServer(expressApp));
    if (requireDirs && requireDirs.length)
        importClassesFromDirectories(requireDirs);

    controllerRegistrator.registerAllActions(); // register only for loaded controllers?
    return controllerRegistrator;
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
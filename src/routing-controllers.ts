import {ControllerRegistrator} from "./ControllerRegistrator";
import {ExpressServer} from "./server/ExpressServer";

/**
 * Registers all loaded actions in your express application.
 *
 * @param expressApp Express application instance
 * @param requireDirs Array of directories where from controller files will be loaded
 */
export function registerActionsInExpressApp(expressApp: any, requireDirs?: string[]): ControllerRegistrator {
    const controllerRegistrator = new ControllerRegistrator(new ExpressServer(expressApp));
    if (requireDirs && requireDirs.length)
        requireDirs.map(dir => controllerRegistrator.loadFiles(dir));

    controllerRegistrator.registerAllActions();
    return controllerRegistrator;
}
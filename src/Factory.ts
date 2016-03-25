import {ControllerRunner} from "./ControllerRunner";
import {ExpressServer} from "./server/ExpressServer";
import {Container} from './ControllerRunner';

export interface FactoryOptions {
    requireDirs?: string[];
    container?: Container;
}

/**
 * Registers all loaded actions in your express application.
 *
 * @param expressApp Express application instance
 * @param requireDirs Array of directories where from controller files will be loaded
 * @param container Container to load objects from
 */
export function registerActionsInExpressApp(expressApp: any, options?: FactoryOptions): ControllerRunner {
    const controllerRunner = new ControllerRunner(new ExpressServer(expressApp));
    if (options && options.container)
        controllerRunner.container = options.container;
    
    if (options && options.requireDirs && options.requireDirs.length)
        options.requireDirs.map(dir => controllerRunner.loadFiles(dir));

    controllerRunner.registerAllActions();
    return controllerRunner;
}
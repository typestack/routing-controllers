import {ControllerRunner} from "./ControllerRunner";
import {ExpressServer} from "./server/ExpressServer";
import {Container} from './ControllerRunner';

/**
 * Registers all loaded actions in your express application.
 *
 * @param expressApp Express application instance
 * @param requireDirs Array of directories where from controller files will be loaded
 */
export function registerActionsInExpressApp(expressApp: any, requireDirs?: string[], container?: Container): ControllerRunner {
    const controllerRunner = new ControllerRunner(new ExpressServer(expressApp));
    if (container)
        controllerRunner.container = container;
    
    if (requireDirs && requireDirs.length)
        requireDirs.map(dir => controllerRunner.loadFiles(dir));

    controllerRunner.registerAllActions();
    return controllerRunner;
}
import {ControllerRunner} from "./ControllerRunner";
import {ExpressServer} from "./server/ExpressServer";
import {Container} from './ControllerRunner';

var _container: Container;

/**
 * Sets the Container object for the ControllerRunner instance.
 * 
 * @param container IoC Container
 */
export function setContainer(container: Container) {
    _container = container;
}

/**
 * Registers all loaded actions in your express application.
 *
 * @param expressApp Express application instance
 * @param requireDirs Array of directories where from controller files will be loaded
 */
export function registerActionsInExpressApp(expressApp: any, requireDirs?: string[]): ControllerRunner {
    const controllerRunner = new ControllerRunner(new ExpressServer(expressApp));
    if (_container)
        controllerRunner.container = _container;
    
    if (requireDirs && requireDirs.length)
        requireDirs.map(dir => controllerRunner.loadFiles(dir));

    controllerRunner.registerAllActions();
    return controllerRunner;
}
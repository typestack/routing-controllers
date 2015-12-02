import {ControllerRunner} from "./ControllerRunner";
import {ExpressHttpFramework} from "./http-framework-integration/ExpressHttpFramework";

/**
 * Registers all loaded actions in your express application.
 *
 * @param expressApp Express application instance
 */
export function registerActionsInExpressApp(expressApp: any): ControllerRunner {
    const controllerRunner = new ControllerRunner(new ExpressHttpFramework(expressApp));
    controllerRunner.registerAllActions();
    return controllerRunner;
}
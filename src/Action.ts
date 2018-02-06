import {NextFunction, Request, Response} from "express";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ContainerInstance} from "typedi";

/**
 * Controller action properties.
 */
export interface Action {

    /**
     * Action Request object.
     */
    request: Request;

    /**
     * Action Response object.
     */
    response: Response;

    /**
     * "Next" function used to call next middleware.
     */
    next: NextFunction;

    /**
     * ActionMetadata of the executing action.
     */
    metadata?: ActionMetadata;

    /**
     * Interceptors to be executed before resolving action result.
     */
    interceptorFns?: Function[];

    /**
     * Container in which this action is running.
     */
    container?: ContainerInstance;

}

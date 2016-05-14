import {ParamMetadata} from "./ParamMetadata";
import {ActionMetadataArgs} from "./args/ActionMetadataArgs";
import {ActionType} from "./types/ActionTypes";
import {ControllerMetadata} from "./ControllerMetadata";
import {ResponseHandlerMetadata} from "./ResponseHandleMetadata";
import {ResponseHandlerTypes} from "./types/ResponsePropertyTypes";

export class ActionMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Action's controller.
     */
    controllerMetadata: ControllerMetadata;

    /**
     * Action's parameters.
     */
    params: ParamMetadata[];

    /**
     * Action's response handlers.
     */
    responseHandlers: ResponseHandlerMetadata[];

    /**
     * Route to be registered for the action.
     */
    route: string|RegExp;

    /**
     * Object on which's method this action is attached.
     * @deprecated
     */
    object: any;

    /**
     * Class on which's method this action is attached.
     */
    target: Function;

    /**
     * Object's method that will be executed on this action.
     */
    method: string;

    /**
     * Action type represents http method used for the registered route. Can be one of the value defined in ActionTypes
     * class.
     */
    type: ActionType;

    /**
     * If set to true then response will be forced to json (serialized and application/json content-type will be used).
     */
    jsonResponse: boolean;

    /**
     * If set to true then response will be forced to simple string text response.
     */
    textResponse: boolean;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    
    constructor(controllerMetadata: ControllerMetadata, args: ActionMetadataArgs) {
        this.controllerMetadata = controllerMetadata;
        
        if (args.route)
            this.route = args.route;
        if (args.object)
            this.object = args.object;
        if (args.target)
            this.target = args.target;
        if (args.method)
            this.method = args.method;
        if (args.type)
            this.type = args.type;
        if (args.options.jsonResponse)
            this.jsonResponse = args.options.jsonResponse;
        if (args.options.textResponse)
            this.textResponse = args.options.textResponse;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get fullRoute(): string|RegExp {
        if (this.route instanceof RegExp)
            return this.route;

        let path: string = "";
        if (this.controllerMetadata.route) path += this.controllerMetadata.route;
        if (this.route && typeof this.route === "string") path += this.route;
        return path;
    }
    
    get isJsonTyped(): boolean {
        if (this.jsonResponse)
            return true;
        if (this.textResponse)
            return false;
        return this.controllerMetadata.isJsonTyped;
    }
    
    get contentTypeHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.CONTENT_TYPE);
    }
    
    get locationHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.LOCATION);
    }
    
    get regirectHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.REDIRECT);
    }
    
    get successCodeHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.SUCCESS_CODE);
    }
    
    get emptyResultHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.EMPTY_RESULT_CODE);
    }
    
    get nullResultHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.NULL_RESULT_CODE);
    }
    
    get undefinedResultHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.UNDEFINED_RESULT_CODE);
    }
    
    get errorCodeHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.ERROR_CODE);
    }
    
    get renderedTemplateHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.RENDERED_TEMPLATE);
    }
    
    get headerHandlers(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.HEADER);
    }
    
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    executeAction(params: any[]) {
        return this.controllerMetadata.instance[this.method].apply(this.controllerMetadata.instance, params);
    }
    
}
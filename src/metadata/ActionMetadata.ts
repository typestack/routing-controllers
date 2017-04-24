import {ParamMetadata} from "./ParamMetadata";
import {ActionMetadataArgs} from "./args/ActionMetadataArgs";
import {ActionType} from "./types/ActionType";
import {ControllerMetadata} from "./ControllerMetadata";
import {ResponseHandlerMetadata} from "./ResponseHandleMetadata";
import {UseMetadata} from "./UseMetadata";
import {ClassTransformOptions} from "class-transformer";

/**
 * Action metadata.
 */
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
     * Action's use metadatas.
     */
    uses: UseMetadata[];

    /**
     * Action's response handlers.
     */
    responseHandlers: ResponseHandlerMetadata[];

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
     * Route to be registered for the action.
     */
    route: string|RegExp;

    /**
     * Full route to this action (includes controller base route).
     */
    fullRoute: string|RegExp;

    /**
     * Indicates if this action uses Body.
     */
    isBodyUsed: boolean;

    /**
     * Indicates if this action uses Uploaded File.
     */
    isFileUsed: boolean;

    /**
     * Indicates if this action uses Uploaded Files.
     */
    isFilesUsed: boolean;

    /**
     * Indicates if controller of this action is json-typed.
     */
    isJsonTyped: boolean;

    /**
     * Class-transformer options for the action response content.
     */
    responseClassTransformOptions: ClassTransformOptions;

    /**
     * Http code to be used on undefined action returned content.
     */
    undefinedResultCode: number;

    /**
     * Http code to be used on null action returned content.
     */
    nullResultCode: number;

    /**
     * Http code to be set on successful response.
     */
    successHttpCode: number;

    /**
     * Specifies redirection url for this action.
     */
    redirect: string;

    /**
     * Rendered template to be used for this controller action.
     */
    renderedTemplate: string;

    /**
     * Response headers to be set.
     */
    headers: { [name: string]: any };

    /**
     * Extra options used by @Body decorator.
     */
    bodyExtraOptions: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(controllerMetadata: ControllerMetadata, args: ActionMetadataArgs) {
        this.controllerMetadata = controllerMetadata;
        this.route = args.route;
        this.target = args.target;
        this.method = args.method;
        this.type = args.type;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds everything action metadata needs.
     * Action metadata can be used only after its build.
     */
    build() {
        const classTransformerResponseHandler = this.responseHandlers.find(handler => handler.type === "response-class-transform-options");
        const undefinedResultHandler = this.responseHandlers.find(handler => handler.type === "on-undefined");
        const nullResultHandler = this.responseHandlers.find(handler => handler.type === "on-null");
        const successCodeHandler = this.responseHandlers.find(handler => handler.type === "success-code");
        const redirectHandler = this.responseHandlers.find(handler => handler.type === "redirect");
        const renderedTemplateHandler = this.responseHandlers.find(handler => handler.type === "rendered-template");
        const bodyParam = this.params.find(param => param.type === "body");

        if (classTransformerResponseHandler)
            this.responseClassTransformOptions = classTransformerResponseHandler.value;
        if (undefinedResultHandler)
            this.undefinedResultCode = undefinedResultHandler.value;
        if (nullResultHandler)
            this.nullResultCode = nullResultHandler.value;
        if (successCodeHandler)
            this.successHttpCode = successCodeHandler.value;
        if (redirectHandler)
            this.redirect = redirectHandler.value;
        if (renderedTemplateHandler)
            this.renderedTemplate = renderedTemplateHandler.value;

        this.bodyExtraOptions = bodyParam ? bodyParam.extraOptions : undefined;
        this.isBodyUsed = !!this.params.find(param => param.type === "body" || param.type === "body-param");
        this.isFilesUsed = !!this.params.find(param => param.type === "files");
        this.isFileUsed = !!this.params.find(param => param.type === "file");
        this.isJsonTyped = this.controllerMetadata.type === "json";
        this.fullRoute = this.buildFullRoute();
        this.headers = this.buildHeaders();
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    /**
     * Builds full action route.
     */
    private buildFullRoute(): string|RegExp {
        if (this.route instanceof RegExp) {
            if (this.controllerMetadata.route) {
                return ActionMetadata.appendBaseRoute(this.controllerMetadata.route, this.route);
            }
            return this.route;
        }

        let path: string = "";
        if (this.controllerMetadata.route) path += this.controllerMetadata.route;
        if (this.route && typeof this.route === "string") path += this.route;
        return path;
    }

    /**
     * Builds action response headers.
     */
    private buildHeaders() {
        const contentTypeHandler = this.responseHandlers.find(handler => handler.type === "content-type");
        const locationHandler = this.responseHandlers.find(handler => handler.type === "location");

        const headers: { [name: string]: string } = {};
        if (locationHandler)
            headers["Location"] = locationHandler.value;

        if (contentTypeHandler)
            headers["Content-type"] = contentTypeHandler.value;

        const headerHandlers = this.responseHandlers.filter(handler => handler.type === "header");
        if (headerHandlers)
            headerHandlers.map(handler => headers[handler.value] = handler.secondaryValue);

        return headers;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Calls action method.
     * Action method is an action defined in a user controller.
     */
    callMethod(params: any[]) {
        return this.controllerMetadata.instance[this.method].apply(this.controllerMetadata.instance, params);
    }

    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------

    /**
     * Appends base route to a given regexp route.
     */
    static appendBaseRoute(baseRoute: string, route: RegExp|string) {
        if (typeof route === "string")
            return `${baseRoute}${route}`;

        if (!baseRoute || baseRoute === "") return route;
        const fullPath = baseRoute.replace("\/", "\\\\/") + route.toString().substr(1);
        return new RegExp(fullPath, route.flags);
    }
    
}
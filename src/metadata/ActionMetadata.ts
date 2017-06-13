import {ParamMetadata} from "./ParamMetadata";
import {ActionMetadataArgs} from "./args/ActionMetadataArgs";
import {ActionType} from "./types/ActionType";
import {ControllerMetadata} from "./ControllerMetadata";
import {ResponseHandlerMetadata} from "./ResponseHandleMetadata";
import {UseMetadata} from "./UseMetadata";
import {ClassTransformOptions} from "class-transformer";
import {Action} from "../Action";
import {InterceptorMetadata} from "./InterceptorMetadata";

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
     * Action's use interceptors.
     */
    interceptors: InterceptorMetadata[];

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
    route: string | RegExp;

    /**
     * Full route to this action (includes controller base route).
     */
    fullRoute: string | RegExp;

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
     * Indicates if this action uses Authorized decorator.
     */
    isAuthorizedUsed: boolean;

    /**
     * Class-transformer options for the action response content.
     */
    responseClassTransformOptions: ClassTransformOptions;

    /**
     * Http code to be used on undefined action returned content.
     */
    undefinedResultCode: number | Function;

    /**
     * Http code to be used on null action returned content.
     */
    nullResultCode: number | Function;

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

    /**
     * Roles set by @Authorized decorator.
     */
    authorizedRoles: any[];

    /**
     * Params to be appended to the method call.
     */
    appendParams?: (action: Action) => any[];

    /**
     * Special function that will be called instead of orignal method of the target.
     */
    methodOverride?: (actionMetadata: ActionMetadata, action: Action, params: any[]) => Promise<any> | any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(controllerMetadata: ControllerMetadata, args: ActionMetadataArgs) {
        this.controllerMetadata = controllerMetadata;
        this.route = args.route;
        this.target = args.target;
        this.method = args.method;
        this.type = args.type;
        this.appendParams = args.appendParams;
        this.methodOverride = args.methodOverride;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds everything action metadata needs.
     * Action metadata can be used only after its build.
     */
    build(responseHandlers: ResponseHandlerMetadata[]) {
        const classTransformerResponseHandler = responseHandlers.find(handler => handler.type === "response-class-transform-options");
        const undefinedResultHandler = responseHandlers.find(handler => handler.type === "on-undefined");
        const nullResultHandler = responseHandlers.find(handler => handler.type === "on-null");
        const successCodeHandler = responseHandlers.find(handler => handler.type === "success-code");
        const redirectHandler = responseHandlers.find(handler => handler.type === "redirect");
        const renderedTemplateHandler = responseHandlers.find(handler => handler.type === "rendered-template");
        const authorizedHandler = responseHandlers.find(handler => handler.type === "authorized");
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
        this.headers = this.buildHeaders(responseHandlers);

        this.isAuthorizedUsed = this.controllerMetadata.isAuthorizedUsed || !!authorizedHandler;
        this.authorizedRoles = (this.controllerMetadata.authorizedRoles || []).concat(authorizedHandler && authorizedHandler.value ? authorizedHandler.value : []);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    /**
     * Builds full action route.
     */
    private buildFullRoute(): string | RegExp {
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
    private buildHeaders(responseHandlers: ResponseHandlerMetadata[]) {
        const contentTypeHandler = responseHandlers.find(handler => handler.type === "content-type");
        const locationHandler = responseHandlers.find(handler => handler.type === "location");

        const headers: { [name: string]: string } = {};
        if (locationHandler)
            headers["Location"] = locationHandler.value;

        if (contentTypeHandler)
            headers["Content-type"] = contentTypeHandler.value;

        const headerHandlers = responseHandlers.filter(handler => handler.type === "header");
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
        const prefix = `${baseRoute.length > 0 && baseRoute.indexOf("/") < 0 ? "/" : ""}${baseRoute}`;
        if (typeof route === "string")
            return `${prefix}${route}`;

        if (!baseRoute || baseRoute === "") return route;

        const fullPath = `^${prefix}${route.toString().substr(1)}?$`;
        
        return new RegExp(fullPath, route.flags);
    }

}
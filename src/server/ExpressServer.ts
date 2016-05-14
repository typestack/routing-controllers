import {Driver} from "./Server";
import {BadHttpActionError} from "./error/BadHttpActionError";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ServerResponse, IncomingMessage} from "http";

/**
 * Integration with Express.js framework.
 */
export class ExpressServer implements Driver {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private express: any) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    registerAction(action: ActionMetadata, executeCallback: (request: IncomingMessage, response: ServerResponse) => any): void {
        const expressAction = action.type.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(action.type);

        this.express[expressAction](action.fullRoute, (request: any, response: any) => executeCallback(request, response));
    }

    getParamFromRequest(request: any, param: any): void {
        switch (param.type) {
            case ParamTypes.BODY:
                return request.body;
            case ParamTypes.PARAM:
                return request.params[param.name];
            case ParamTypes.QUERY:
                return request.query[param.name];
            case ParamTypes.BODY_PARAM:
                return request.body[param.name];
            case ParamTypes.COOKIE:
                return request.cookies[param.name];
        }
    }

    handleSuccess(action: ActionMetadata, result: any): void {


        /* const handleResultOptions: ResultHandleOptions = {
         request: request,
         response: response,
         content: undefined,
         asJson: action.isJsonTyped,
         successHttpCode: successCodeMetadata ? successCodeMetadata.value : undefined,
         errorHttpCode: errorCodeMetadata ? errorCodeMetadata.value : undefined,
         emptyResultCode: emptyResultCodeMetadata ? emptyResultCodeMetadata.value : undefined,
         nullResultCode: nullResultCodeMetadata ? nullResultCodeMetadata.value : undefined,
         undefinedResultCode: undefinedResultCodeMetadata ? undefinedResultCodeMetadata.value : undefined,
         redirect: redirectMetadata ? redirectMetadata.value : undefined,
         headers: headerMetadatas,
         renderedTemplate: renderedTemplateMetadata ? renderedTemplateMetadata.value : undefined,
         interceptors: []
         };

         if (contentTypeMetadata && contentTypeMetadata.value)
         handleResultOptions.headers.push({ name: "Content-Type", value: contentTypeMetadata.value });

         if (locationMetadata && locationMetadata.value)
         handleResultOptions.headers.push({ name: "Location", value: locationMetadata.value });*/


        if (options.undefinedResultCode && options.content === undefined) {
            options.response.status(options.undefinedResultCode);

        } else if (options.nullResultCode && options.content === null) {
            options.response.status(options.nullResultCode);

        } else if (options.emptyResultCode && (options.content === null || options.content === undefined || options.content === false || options.content === "")) {
            options.response.status(options.emptyResultCode);

        } else if (options.successHttpCode) {
            options.response.status(options.successHttpCode);
        }

        this.handleResult(options);
    }

    handleError(action: ActionMetadata, error: any): void {
        if (options.errorHttpCode)
            options.response.status(options.errorHttpCode);

        this.handleResult(options);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleResult() {
        if (options.headers)
            options.headers.forEach(header => options.response.header(header.name, header.value));

        // think no need of it, since framework automatically handles it?
        /*if (!err && options.successHttpCode === 204) {
            if (options.asJson) {
                options.response.json();
            } else {
                options.response.send();
            }
            
        } else */if (options.content !== null && options.content !== undefined) {
            const result = this._interceptorHelper.callInterceptors(options);
            if (options.renderedTemplate) {
                const renderOptions = result && result instanceof Object ? result : {};
                this.express.render(options.renderedTemplate, renderOptions, (err: any, html: string) => {
                    if (err && options.asJson) {
                        options.response.json(err);

                    } else if (err && !options.asJson) {
                        options.response.send(err);

                    } else if (html) {
                        options.response.send(html);
                    }
                });
            } else if (options.redirect) {
                options.response.redirect(options.redirect);

            } else if (options.asJson) {
                options.response.json(result);

            } else {
                options.response.send(result);
            }
        } else {
            if (options.asJson) {
                options.response.json();
            } else {
                options.response.send();

            }
        }

        options.response.end();
    }

}
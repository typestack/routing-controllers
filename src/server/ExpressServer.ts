import {Driver} from "./Server";
import {BadHttpActionError} from "./error/BadHttpActionError";
import {ResultHandleOptions} from "./../ResultHandleOptions";
import {MiddlewareHelper} from "../middleware/MiddlewareHelper";
import {ParamTypes} from "../metadata/types/ParamTypes";

/**
 * Integration with Express.js framework.
 */
export class ExpressServer implements Driver {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _interceptorHelper = new MiddlewareHelper();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private express: any) {
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    set interceptorHelper(interceptorHelper: MiddlewareHelper) {
        this._interceptorHelper = interceptorHelper;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    registerAction(route: string|RegExp, actionType: string, executeCallback: (request: any, response: any) => any): void {
        const expressAction = actionType.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(actionType);

        this.express[expressAction](route, (request: any, response: any) => executeCallback(request, response));
    }

    getParamFromRequest(request: any, paramName: string, paramType: ParamTypes): void {
        switch (paramType) {
            case ParamTypes.BODY:
                return request.body;
            case ParamTypes.PARAM:
                return request.params[paramName];
            case ParamTypes.QUERY:
                return request.query[paramName];
            case ParamTypes.BODY_PARAM:
                return request.body[paramName];
            case ParamTypes.COOKIE:
                return request.cookies[paramName];
        }
    }

    handleSuccess(options: ResultHandleOptions): void {

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

    handleError(options: ResultHandleOptions): void {
        if (options.errorHttpCode)
            options.response.status(options.errorHttpCode);

        this.handleResult(options);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleResult(options: ResultHandleOptions) {
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
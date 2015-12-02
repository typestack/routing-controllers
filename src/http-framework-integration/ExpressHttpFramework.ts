import {HttpFramework} from "./HttpFramework";
import {ParamType} from "../metadata/ParamMetadata";
import {ResponseInterceptorInterface} from "../interceptor/ResponseInterceptorInterface";
import {BadHttpActionError} from "./error/BadHttpActionError";
import {ResultHandleOptions} from "./../ResultHandleOptions";
import {InterceptorHelper} from "../interceptor/InterceptorHelper";

/**
 * Integration with Express.js framework.
 *
 * @internal
 */
export class ExpressHttpFramework implements HttpFramework {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _interceptorHelper = new InterceptorHelper();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private express: any) {
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    set interceptorHelper(interceptorHelper: InterceptorHelper) {
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

    getParamFromRequest(request: any, paramName: string, paramType: ParamType): void {
        switch (paramType) {
            case ParamType.BODY:
                return request.body;
            case ParamType.PARAM:
                return request.params[paramName];
            case ParamType.QUERY:
                return request.query[paramName];
            case ParamType.BODY_PARAM:
                return request.body[paramName];
            case ParamType.COOKIE:
                return request.cookies[paramName];
        }
    }

    handleSuccess(options: ResultHandleOptions): void {
        this.handleResult(options);
    }

    handleError(options: ResultHandleOptions): void {
        this.handleResult(options);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleResult(options: ResultHandleOptions) {
        if (options.httpCode)
            options.response.status(options.httpCode);

        if (options.content !== null && options.content !== undefined) {
            const result = this._interceptorHelper.callInterceptors(options);
            options.asJson ? options.response.json(result) : options.response.send(result);
        }

        options.response.end();
    }

}
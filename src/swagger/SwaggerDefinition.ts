import {JsonController, Controller} from "../decorator/controllers";
import {Get} from "../decorator/methods";
import {MetadataBuilder} from "../metadata-builder/MetadataBuilder";
import {UseMetadata} from "../metadata/UseMetadata";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {JsonResponse, Header} from "../decorator/decorators";
import {Res} from "../decorator/params";

export interface SwaggerOptions {
    /**
     * Defaults to false
     */
    enabled?: boolean;
    /**
     * Default value /swagger.json
     */
    route?: string;

    /**
     * Definition basic data
     */
    info?: {
        title?: string;
        description?: string;
        termsOfUse?: string;
        contact?: {
           name?: string;
           url?: string;
           email?: string;
        }[];
        license?: string;
        version?: string;
    };
    consumes?: string[];
    produces?: string[];
}

/**
 * Builds and adds a swagger definition controller
 * Created by Pierre Awaragi on 2017-02-16.
 */
export class SwaggerDefinition {
    private definition: any;

    constructor(private swagger: SwaggerOptions) {
    }

    /**
     * Adds a swagger definition controller
     * @param basePath
     */
    public controller() {
        let definition = this.definition;

        @Controller(this.swagger.route || "/swagger.json")
        class SwaggerController {
            @Get()
            get(): string {
                return JSON.stringify(definition);
            }
        }

        return this;
    }

    /**
     * builds the swagger definition
     * @param swagger
     */
    bootstrap(basePath: string): SwaggerDefinition {
        this.definition = {
            swagger: "2.0",
            basePath: basePath,
            paths: this.paths(),
        };
        return this;
    }

    /**
     * Constructs the paths based on collected metadata
     * @returns {any}
     */
    private paths() {
        let metadataBuilder: MetadataBuilder = new MetadataBuilder();
        const middlewares = metadataBuilder.buildMiddlewareMetadata();
        const interceptors = metadataBuilder.buildInterceptorMetadata();
        const controllers = metadataBuilder.buildControllerMetadata();

        let paths: any = {};
        controllers.forEach(controller => {
            controller.actions.forEach(action => {
                let i = 0;
                let route = "" + action.fullRoute;

                if (!paths[route]) {
                    paths[route] = {};
                }

                let uses: any = [];
                action.uses.forEach((useMetada: UseMetadata) => {
                    if (useMetada.afterAction) {
                        uses.push(`+${useMetada.middleware.name}`);
                    } else {
                        uses.push(`-${useMetada.middleware.name}`);
                    }
                });
                uses.sort();
                let description = (uses.length > 0 ? (`(${uses.join(", ")})`) : "");

                let empty1: any = [];
                let empty2: any = [];
                let type = {
                    operationId: action.method,
                    description: description,
                    // responses: {
                    //     200: {
                    //         description: "Success"
                    //     }
                    // },
                    produces: empty1,
                    parameters: empty2,
                };

                if (action.jsonResponse || action.isJsonTyped) {
                    type.produces = ["application/json"];
                } else if (action.contentTypeHandler && action.contentTypeHandler.value) {
                    type.produces = [action.contentTypeHandler.value];
                }

                action.params.forEach(param => {
                    let typeParameter = {
                        in: param.type,
                        name: param.name || null,
                        type: param.reflectedType.name || null,
                        required: param.isRequired || false,
                    };
                    switch (param.type) {
                        case ParamTypes.RESPONSE:
                        case ParamTypes.REQUEST:
                            typeParameter = null;
                            break;
                        case ParamTypes.BODY:
                            break;
                        case ParamTypes.UPLOADED_FILE:
                            typeParameter.type = param.type;
                            break;
                        case ParamTypes.UPLOADED_FILES:
                            delete typeParameter.type;
                            break;
                    }

                    if (typeParameter) {
                        type.parameters.push(typeParameter);
                    }
                });

                paths[route][action.type] = type;
            });
        });

        return paths;
    }


}
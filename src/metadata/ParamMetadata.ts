import {ValidatorOptions} from "class-validator";
import {ActionMetadata} from "./ActionMetadata";
import {ParamMetadataArgs} from "./args/ParamMetadataArgs";
import {ParamType} from "./types/ParamTypes";
import {ClassTransformOptions} from "class-transformer";

export class ParamMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Parameter's action.
     */
    actionMetadata: ActionMetadata;

    /**
     * Object on which's method's parameter this parameter is attached.
     */
    object: any;

    /**
     * Method on which's parameter is attached.
     */
    method: string;

    /**
     * Index (# number) of the parameter in the method signature.
     */
    index: number;

    /**
     * Parameter type.
     */
    type: ParamType;

    /**
     * Parameter name.
     */
    name: string;

    /**
     * Parameter target type.
     */
    targetType: any;

    /**
     * Parameter target type's name in lowercase.
     */
    targetName: string = "";

    /**
     * Indicates if target type is an object.
     */
    isTargetObject: boolean = false;

    /**
     * Parameter target.
     */
    target: any;

    /**
     * Specifies if parameter should be parsed as json or not.
     */
    parse: boolean;

    /**
     * Indicates if this parameter is required or not
     */
    required: boolean;

    /**
     * Transforms the value.
     */
    transform: (value?: any, request?: any, response?: any) => Promise<any>|any;

    /**
     * Additional parameter options. For example it can be uploading options.
     */
    extraOptions: any;

    /**
     * Class transform options used to perform plainToClass operation.
     */
    classTransform?: ClassTransformOptions;

    /**
     * If true, class-validator will be used to validate param object.
     * If validation options are given then it means validation will be applied (is true).
     */
    validate?: boolean|ValidatorOptions;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(actionMetadata: ActionMetadata, args: ParamMetadataArgs) {
        this.actionMetadata = actionMetadata;
        
        this.target = args.target;
        this.method = args.method;
        this.extraOptions = args.extraOptions;
        if (args.index !== undefined)
            this.index = args.index;
        if (args.type)
            this.type = args.type;
        if (args.name)
            this.name = args.name;
        if (args.parse)
            this.parse = args.parse;
        if (args.required)
            this.required = args.required;
        if (args.transform)
            this.transform = args.transform;
        if (args.classTransform)
            this.classTransform = args.classTransform;
        if (args.validate !== undefined) 
            this.validate = args.validate;

        if (args.targetType) {
            this.targetType = args.targetType;
            if (args.targetType instanceof Function && args.targetType.name) {
                this.targetName = args.targetType.name.toLowerCase();

            } else if (typeof args.targetType === "string") {
                this.targetName = args.targetType.toLowerCase();
            }
            this.isTargetObject = this.targetType instanceof Function || this.targetType.toLowerCase() === "object";
        }
    }

}
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
     * Reflected type of the parameter.
     */
    reflectedType: any;

    /**
     * Parameter name.
     */
    name: string;

    /**
     * Parameter format.
     */
    format: any;

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
    classTransformOptions: ClassTransformOptions;

    /**
     * If true, class-validator will be used to validate param object.
     */
    validate: boolean;

    /**
     * Class-validator options used to transform and validate param object.
     */
    validateOptions: ValidatorOptions;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    constructor(actionMetadata: ActionMetadata, args: ParamMetadataArgs) {
        this.actionMetadata = actionMetadata;
        
        this.target = args.target;
        this.method = args.method;
        this.reflectedType = args.reflectedType;
        if (args.index !== undefined)
            this.index = args.index;
        if (args.type)
            this.type = args.type;
        if (args.name)
            this.name = args.name;
        if (args.format)
            this.format = args.format;
        if (args.parse)
            this.parse = args.parse;
        if (args.required)
            this.required = args.required;
        if (args.transform)
            this.transform = args.transform;
        if (args.classTransformOptions)
            this.classTransformOptions = args.classTransformOptions;
        if (args.validate !== undefined) 
            this.validate = args.validate;
        if (args.validateOptions)
            this.validateOptions = args.validateOptions;
        
        this.extraOptions = args.extraOptions;
    }

}
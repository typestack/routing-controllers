import {ValidatorOptions} from 'class-validator';
import {ActionMetadata} from './ActionMetadata';
import {ParamMetadataArgs} from './args/ParamMetadataArgs';
import {ParamType} from './types/ParamType';
import {ClassTransformOptions} from 'class-transformer';
import {Action} from '../Action';

/**
 * Action Parameter metadata.
 */
export class ParamMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Parameter's action.
     */
    public actionMetadata: ActionMetadata;

    /**
     * Class transform options used to perform plainToClass operation.
     */
    public classTransform?: ClassTransformOptions;

    /**
     * Additional parameter options.
     * For example it can be uploader middleware options or body-parser middleware options.
     */
    public extraOptions: any;

    /**
     * Index (# number) of the parameter in the method signature.
     */
    public index: number;

    /**
     * Indicates if target type is an object.
     */
    public isTargetObject: boolean = false;

    /**
     * Method on which's parameter is attached.
     */
    public method: string;

    /**
     * Parameter name.
     */
    public name: string;

    /**
     * Object on which's method's parameter this parameter is attached.
     */
    public object: any;

    /**
     * Specifies if parameter should be parsed as json or not.
     */
    public parse: boolean;

    /**
     * Indicates if this parameter is required or not
     */
    public required: boolean;

    /**
     * Parameter target.
     */
    public target: any;

    /**
     * Parameter target type's name in lowercase.
     */
    public targetName: string = '';

    /**
     * Parameter target type.
     */
    public targetType?: any;

    /**
     * Transforms the value.
     */
    public transform: (action: Action, value?: any) => Promise<any>|any;

    /**
     * Parameter type.
     */
    public type: ParamType;

    /**
     * If true, class-validator will be used to validate param object.
     * If validation options are given then it means validation will be applied (is true).
     */
    public validate?: boolean|ValidatorOptions;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(actionMetadata: ActionMetadata, args: ParamMetadataArgs) {
        this.actionMetadata = actionMetadata;

        this.target = args.object.constructor;
        this.method = args.method;
        this.extraOptions = args.extraOptions;
        this.index = args.index;
        this.type = args.type;
        this.name = args.name;
        this.parse = args.parse;
        this.required = args.required;
        this.transform = args.transform;
        this.classTransform = args.classTransform;
        this.validate = args.validate;

        if (args.explicitType) {
            this.targetType = args.explicitType;
        } else {
            const ParamTypes = (Reflect as any).getMetadata('design:paramtypes', args.object, args.method);
            if (typeof ParamTypes !== 'undefined') {
                this.targetType = ParamTypes[args.index];
            }
        }

        if (this.targetType) {
            if (this.targetType instanceof Function && this.targetType.name) {
                this.targetName = this.targetType.name.toLowerCase();

            } else if (typeof this.targetType === 'string') {
                this.targetName = this.targetType.toLowerCase();
            }
            this.isTargetObject = this.targetType instanceof Function || this.targetType.toLowerCase() === 'object';
        }
    }

}

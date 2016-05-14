import {ActionMetadata} from "./ActionMetadata";
import {ParamMetadataArgs} from "./args/ParamMetadataArgs";
import {ParamTypes} from "./types/ParamTypes";

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
    type: ParamTypes;

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
    parseJson: boolean;

    /**
     * Indicates if this parameter is required or not
     */
    isRequired: boolean;

    /**
     * Transforms the value.
     */
    transform: (value?: any, request?: any, response?: any) => Promise<any>|any;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    constructor(actionMetadata: ActionMetadata, args: ParamMetadataArgs) {
        this.actionMetadata = actionMetadata;

        if (args.object)
            this.object = args.object;
        if (args.target)
            this.target = args.target;
        if (args.method)
            this.method = args.method;
        if (args.index)
            this.index = args.index;
        if (args.type)
            this.type = args.type;
        if (args.name)
            this.name = args.name;
        if (args.format)
            this.format = args.format;
        if (args.parseJson)
            this.parseJson = args.parseJson;
        if (args.isRequired)
            this.isRequired = args.isRequired;
        if (args.transform)
            this.transform = args.transform;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    
}
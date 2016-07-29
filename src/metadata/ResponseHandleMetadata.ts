import {ActionMetadata} from "./ActionMetadata";
import {ResponseHandlerMetadataArgs} from "./args/ResponseHandleMetadataArgs";
import {ResponseHandlerType} from "./types/ResponsePropertyTypes";

export class ResponseHandlerMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Response handler's action.
     */
    actionMetadata: ActionMetadata;

    /**
     * Class on which's method decorator is set.
     */
    target: Function;

    /**
     * Method on which decorator is set.
     */
    method: string;

    /**
     * Property type. See ResponsePropertyMetadataType for possible values.
     */
    type: ResponseHandlerType;

    /**
     * Property value. Can be status code, content-type, header name, template name, etc.
     */
    value: any;

    /**
     * Secondary property value. Can be header value for example.
     */
    secondaryValue: any;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    constructor(actionMetadata: ActionMetadata, args: ResponseHandlerMetadataArgs) {
        this.actionMetadata = actionMetadata;

        if (args.target)
            this.target = args.target;
        if (args.method)
            this.method = args.method;
        if (args.type)
            this.type = args.type;
        if (args.value)
            this.value = args.value;
        if (args.secondaryValue)
            this.secondaryValue = args.secondaryValue;
    }

}
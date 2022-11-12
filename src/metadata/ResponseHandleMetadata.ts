import { ResponseHandlerMetadataArgs } from './args/ResponseHandleMetadataArgs';
import { ResponseHandlerType } from './types/ResponseHandlerType';
import { Newable } from '../types/Types';

/**
 * Response handler metadata.
 */
export class ResponseHandlerMetadata {
  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Class on which's method decorator is set.
   */
  target: Newable;

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
  // Constructor
  // -------------------------------------------------------------------------

  constructor(args: ResponseHandlerMetadataArgs) {
    this.target = args.target;
    this.method = args.method;
    this.type = args.type;
    this.value = args.value;
    this.secondaryValue = args.secondaryValue;
  }
}

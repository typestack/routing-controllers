/**
 * Response handler type.
 */
export type ResponseHandlerType =
  | 'success-code'
  | 'error-code'
  | 'content-type'
  | 'header'
  | 'rendered-template'
  | 'redirect'
  | 'location'
  | 'on-null'
  | 'on-undefined'
  | 'response-class-transform-options'
  | 'authorized';

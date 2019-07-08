/**
 * Controller action's parameter type.
 */
export type ParamType =
  | 'body'
  | 'body-param'
  | 'query'
  | 'queries'
  | 'header'
  | 'headers'
  | 'file'
  | 'files'
  | 'param'
  | 'params'
  | 'session'
  | 'session-param'
  | 'state'
  | 'cookie'
  | 'cookies'
  | 'request'
  | 'response'
  | 'context'
  | 'current-user'
  | 'custom-converter';

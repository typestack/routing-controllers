/**
 * Extra options that apply to each controller action.
 */
export interface ControllerOptions {
  /**
   * If set to false, class-transformer won't be used to perform request serialization.
   */
  transformRequest?: boolean;

  /**
   * If set to false, class-transformer won't be used to perform response serialization.
   */
  transformResponse?: boolean;
}

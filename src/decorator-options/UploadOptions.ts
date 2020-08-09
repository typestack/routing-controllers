/**
 * Upload decorator parameters.
 */
export interface UploadOptions {
  /**
   * If set to true then uploaded file become required.
   * If user performs a request and file is not in a request then routing-controllers will throw an error.
   */
  required?: boolean;

  /**
   * Special upload options passed to an upload middleware.
   */
  options?: any;
}

/**
 * Metadata args for Resolve.
 */
export interface ResolveMetadataArgs {

    /**
     * Object on which resolve is applied.
     */
    object: Object;
    
    /**
     * Method on which resolve is applied.
     */
    propertyName: string;

    /**
     * Resolve name.
     */
    name?: string;

    /**
     * Indicates if data loader is enabled for this resolve method or not.
     * By default its enabled.
     */
    dataLoader?: boolean;

}
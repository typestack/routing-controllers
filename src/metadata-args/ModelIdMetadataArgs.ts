/**
 * Metadata used to store registered model ids.
 */
export interface ModelIdMetadataArgs {
    
    /**
     * Object class of this "use".
     */
    target: Function;
    
    /**
     * Class property decorated as model id.
     */
    propertyName: string;

}
/**
 * Metadata args for GraphQL mutations and queries.
 */
export interface GraphActionMetadataArgs {

    /**
     * Action type.
     */
    type: "query"|"mutation";

    /**
     * Object on which action is applied.
     */
    object: Object;

    /**
     * Method on which action is applied.
     */
    propertyName: string;

    /**
     * Mutation / query name.
     */
    name?: string;

}
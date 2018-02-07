/**
 * Metadata args for Resolvers.
 */
export interface ResolverMetadataArgs {

    /**
     * Class on which resolver is applied.
     */
    target: Function;

    /**
     * Resolver name.
     */
    name?: string;

}
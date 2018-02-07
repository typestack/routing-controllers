/**
 * Resolvers can implement this type to provide a proper method signatures for T.
 */
export type ResolverInterface<T> = {
    [P in keyof T]?: (entities: T|T[], args?: object, context?: any) => Promise<(T[P][])|T[P]>|((T[P][])|T[P]);
};

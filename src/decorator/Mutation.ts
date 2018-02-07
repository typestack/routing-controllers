import {getMetadataArgsStorage} from "../index";

/**
 * Creates a mutation for a GraphQL controller.
 */
export function Mutation(name?: string) {
    return function (object: Object, propertyName: string) {
        getMetadataArgsStorage().graphActions.push({
            type: "mutation",
            object: object,
            propertyName: propertyName,
            name: name
        });
    };
}
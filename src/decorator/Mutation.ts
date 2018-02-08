import {getMetadataArgsStorage} from "../index";

/**
 * Creates a mutation for a GraphQL controller.
 */
export function Mutation(options?: { name?: string, transaction?: boolean }) {
    return function (object: Object, propertyName: string) {
        getMetadataArgsStorage().graphActions.push({
            type: "mutation",
            object: object,
            propertyName: propertyName,
            name: (options && options.name) ? options.name : undefined,
            transaction: (options && options.transaction === false) ? false : true
        });
    };
}
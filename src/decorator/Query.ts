import {getMetadataArgsStorage} from "../index";

/**
 * Creates a query for a GraphQL controller.
 */
export function Query(name?: string) {
    return function (object: Object, propertyName: string) {
        getMetadataArgsStorage().graphActions.push({
            type: "query",
            object: object,
            propertyName: propertyName,
            name: name
        });
    };
}
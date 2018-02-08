import {getMetadataArgsStorage} from "../index";

/**
 * Creates a query for a GraphQL controller.
 */
export function Query(options?: { name?: string, transaction?: boolean }) {
    return function (object: Object, propertyName: string) {
        getMetadataArgsStorage().graphActions.push({
            type: "query",
            object: object,
            propertyName: propertyName,
            name: (options && options.name) ? options.name : undefined,
            transaction: (options && options.transaction === false) ? false : true
        });
    };
}
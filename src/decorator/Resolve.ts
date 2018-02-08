import {getMetadataArgsStorage} from "../index";

/**
 * Used in resolvers to mark method as resolving some data.
 */
export function Resolve(options?: { name?: string, dataLoader?: boolean }) {
    return function (object: Object, propertyName: string) {
        getMetadataArgsStorage().resolves.push({
            object: object,
            propertyName: propertyName,
            name: (options && options.name) ? options.name : undefined,
            dataLoader: (options && options.dataLoader === true) ? true : false
        });
    };
}
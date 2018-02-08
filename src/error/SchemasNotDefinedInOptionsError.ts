/**
 * Thrown when user uses graph controller without schemas option defined in options.
 */
export class SchemasNotDefinedInOptionsError extends Error {

    name = "SchemasNotDefinedInOptionsError";

    constructor() {
        super(`You must provide "schemas" in options in the configuration where from GraphQL schemas must be loaded and used.`);
        Object.setPrototypeOf(this, SchemasNotDefinedInOptionsError.prototype);
    }

}

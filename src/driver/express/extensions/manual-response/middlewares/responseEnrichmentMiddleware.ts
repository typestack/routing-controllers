/**
 * Enrich express's response object with awareness of when the response write has been manually ended correctly
 * @param request
 * @param response
 * @param next
 */
export function responseEnrichmentMiddleware(request: any, response: any, next: any) {
    // Can apply permanent request/response modifications here
    next ();
}
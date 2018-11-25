import { enrichResponseWithEndAwareness } from "../enrichResponseWithEndAwareness";

/**
 * Enrich express's response object with awareness of when the response write has been manually ended correctly
 * @param request
 * @param response
 * @param next
 */
// TODO: If possible later on, allow to include options to @Response({manual: true}), to only then enrich the response with end-awareness
export function responseEnrichmentMiddleware(request: any, response: any, next: any) {
    enrichResponseWithEndAwareness(response);
    next();
}
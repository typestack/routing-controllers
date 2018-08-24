/**
 * Controller decorator parameters.
 */
export interface ControllerOptions {

    /**
     * Extra path you can apply as a base route to all controller actions
     */
    baseRoute?: string;

    /**
     * Subdomain for all actions registered in this controller. 
     */
    subdomain?: string;

}
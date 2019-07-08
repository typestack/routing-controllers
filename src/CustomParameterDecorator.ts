import {Action} from './Action';

/**
 * Used to register custom parameter handler in the controller action parameters.
 */
export interface CustomParameterDecorator {

    /**
     * Indicates if this parameter is required or not.
     * If parameter is required and value provided by it is not set then routing-controllers will throw an error.
     */
    required?: boolean;

    /**
     * Factory function that returns value to be written to this parameter.
     * In function it provides you Action object which contains current request, response, context objects.
     * It also provides you original value of this parameter.
     * It can return promise, and if it returns promise then promise will be resolved before calling controller action.
     */
    value: (action: Action, value?: any) => Promise<any>|any;

}

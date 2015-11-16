import {ResponseInterceptorInterface} from "../ResponseInterceptorInterface";

export interface ResponseInterceptorMetadata {
    object: Function;
    instance: ResponseInterceptorInterface;
    priority: number;
}
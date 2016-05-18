import {ServerResponse, IncomingMessage} from "http";

export interface ActionCallbackOptions {

    context?: any;
    request: IncomingMessage;
    response: ServerResponse;
    next: Function;
    
}
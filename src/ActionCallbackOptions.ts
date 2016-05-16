import {ServerResponse, IncomingMessage} from "http";

export interface ActionCallbackOptions {
    
    request: IncomingMessage;
    response: ServerResponse;
    next: Function;
    resolver?: Function;
    rejecter?: Function;
    
}
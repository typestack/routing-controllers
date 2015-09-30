export interface ActionMetadata {
    path: string;
    object: any;
    method: string;
    type: number;
}

export enum ActionTypes {
    GET = 1,
    POST = 2,
    PUT = 3,
    PATCH = 4,
    DELETE = 5
}
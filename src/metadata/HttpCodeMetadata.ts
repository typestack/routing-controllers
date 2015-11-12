export interface HttpCodeMetadata {
    code: number;
    object: any;
    method: string;
    type: number;
}

export enum HttpCodeType {
    SUCCESS = 1
}
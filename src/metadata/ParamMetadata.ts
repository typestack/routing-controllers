export interface ParamMetadata {
    object: any;
    methodName: string;
    index: number;
    type: ParamType;
    name?: string;
    format?: any;
    parseJson: boolean;
    isRequired: boolean;
}

export enum ParamType {
    BODY = 1,
    QUERY = 2,
    BODY_PARAM = 3,
    PARAM = 4,
    COOKIE = 5,
    REQUEST = 6,
    RESPONSE = 7
}

export interface ParamOptions {
    required?: boolean;
    parseJson?: boolean;
}
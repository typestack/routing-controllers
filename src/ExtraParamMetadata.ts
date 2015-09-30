export interface ExtraParamMetadata {
    object: any;
    methodName: string;
    index: number;
    type: number;
    name?: string;
    format?: any;
    parseJson: boolean;
}

export enum ExtraParamTypes {
    BODY = 1,
    QUERY = 2,
    BODY_PARAM = 3,
    PARAM = 4,
    COOKIE = 5
}
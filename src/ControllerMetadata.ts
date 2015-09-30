export interface ControllerMetadata {
    path: string;
    object: Function;
    type: number;
}

export enum ControllerTypes {
    DEFAULT = 0,
    JSON = 1
}
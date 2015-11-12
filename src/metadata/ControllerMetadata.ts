export interface ControllerMetadata {
    path: string;
    object: Function;
    instance?: Object;
    type: number;
}

export enum ControllerType {
    DEFAULT = 0,
    JSON = 1
}
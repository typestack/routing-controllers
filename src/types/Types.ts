export type Newable = { new (...args: any[]): any };

export type ClassType = Record<string, unknown>;

export type Callable = (...args: any[]) => any;

export type DecoratorFunction = (object: any, methodName: string) => void;

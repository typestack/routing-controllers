// export type NextCallable = NextFunction | Next;

export type Newable = { new (...args: any[]): any };

export type ClassType = Record<string, unknown>;

// export type CallableVoid = () => void;

// export type CallableAny = () => any;

// export type CallableAnyVoid = (...args: any[]) => void;

export type Callable = (...args: any[]) => any;

export type DecoratorFunction = (object: any, methodName: string) => void;

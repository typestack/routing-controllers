export interface IHelloWorldService {
    greet(): string;
}

export class HelloWorldService implements IHelloWorldService {
    greet() {
        return 'Hello World!';
    }
}
import {Kernel} from 'inversify';
import ResponseController from './controllers/ResponseController';
import {IHelloWorldService, HelloWorldService} from './services/HelloWorldService';

let kernel = new Kernel();

kernel.bind<IHelloWorldService>('IHelloWorldService').to(HelloWorldService);
kernel.bind<ResponseController>('ResponseController').to(ResponseController);

export default kernel;
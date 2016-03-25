import ResponseController from './controllers/ResponseController';
import {IHelloWorldService, HelloWorldService} from './services/HelloWorldService';

var kernel: any = {};

kernel['ResponseController'] = new ResponseController(new HelloWorldService());

export default kernel;
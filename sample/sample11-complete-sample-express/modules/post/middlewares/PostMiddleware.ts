import {ExpressMiddlewareInterface} from '../../../../../src/driver/express/ExpressMiddlewareInterface';

export class PostMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: Function): any {
    console.log('logging request from post middleware...');
    next();
  }
}

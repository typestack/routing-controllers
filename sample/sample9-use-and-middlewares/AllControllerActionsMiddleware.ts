import {ExpressMiddlewareInterface} from '../../src/driver/express/ExpressMiddlewareInterface';

export class AllControllerActionsMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: Function): any {
    console.log('controller action run');
    next();
  }
}

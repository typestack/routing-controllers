import {ExpressMiddlewareInterface} from '../../src/driver/express/ExpressMiddlewareInterface';
import {Middleware} from '../../src/decorator/Middleware';

@Middleware({type: 'before'})
export class LoggerMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: Function): any {
    console.log('logging request ...');
    next();
  }
}

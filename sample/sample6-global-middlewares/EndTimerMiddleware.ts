import {ExpressMiddlewareInterface} from '../../src/driver/express/ExpressMiddlewareInterface';
import {Middleware} from '../../src/decorator/Middleware';

@Middleware({type: 'after'})
export class EndTimerMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: Function): any {
    console.log('timer is ended.');
    next();
  }
}

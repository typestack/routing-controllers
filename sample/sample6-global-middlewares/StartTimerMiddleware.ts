import { ExpressMiddlewareInterface } from '../../src/driver/express/ExpressMiddlewareInterface';
import { Middleware } from '../../src/decorator/Middleware';

@Middleware({ type: 'before' })
export class StartTimerMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next?: Function): any {
    console.log('timer is started.');
    next();
  }
}

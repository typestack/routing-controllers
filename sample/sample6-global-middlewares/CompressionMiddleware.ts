import { ExpressMiddlewareInterface } from '../../src/driver/express/ExpressMiddlewareInterface';
import { Middleware } from '../../src/decorator/Middleware';

@Middleware({ type: 'before' })
export class CompressionMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next?: Function): any {
    console.log('hello compression ...');
    next();
  }
}

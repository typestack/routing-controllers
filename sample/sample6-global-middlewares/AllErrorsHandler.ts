import { ExpressErrorMiddlewareInterface } from '../../src/driver/express/ExpressErrorMiddlewareInterface';
import { Middleware } from '../../src/decorator/Middleware';

@Middleware({ type: 'after' })
export class AllErrorsHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: Function): void {
    console.log('Error handled: ', error);
    next(error);
  }
}

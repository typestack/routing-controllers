import {ExpressErrorMiddlewareInterface} from '../../../../../src/driver/express/ExpressErrorMiddlewareInterface';
import {Middleware} from '../../../../../src/decorator/Middleware';

@Middleware({type: 'after'})
export class BlogErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error: any, request: any, response: any, next?: Function): void {
    console.log('Error handled on blog handler: ', error);
    next(error);
  }
}

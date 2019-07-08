import {ExpressMiddlewareInterface} from '../../../../src/driver/express/ExpressMiddlewareInterface';
import {defaultFakeService} from '../FakeService';
import {Middleware} from '../../../../src/decorator/Middleware';

@Middleware({type: 'before'})
export class FileMiddleware implements ExpressMiddlewareInterface {
  public use(context: any, next?: (err?: any) => Promise<any>): Promise<any> {
    defaultFakeService.fileMiddleware();
    return next();
  }
}

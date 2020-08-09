import { ExpressMiddlewareInterface } from '../../../../src/driver/express/ExpressMiddlewareInterface';
import { defaultFakeService } from '../FakeService';
import { Middleware } from '../../../../src/decorator/Middleware';

@Middleware({ type: 'before' })
export class VideoMiddleware implements ExpressMiddlewareInterface {
  use(context: any, next?: (err?: any) => Promise<any>): Promise<any> {
    defaultFakeService.videoMiddleware();
    return next();
  }
}

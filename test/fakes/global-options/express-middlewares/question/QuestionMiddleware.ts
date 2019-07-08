import {ExpressMiddlewareInterface} from '../../../../../src/driver/express/ExpressMiddlewareInterface';
import {defaultFakeService} from '../../FakeService';
import {Middleware} from '../../../../../src/decorator/Middleware';

@Middleware({type: 'before'})
export class QuestionMiddleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: (err?: any) => any): any {
    defaultFakeService.questionMiddleware();
    return next();
  }
}

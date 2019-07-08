import {ExpressErrorMiddlewareInterface} from '../../../../../src/driver/express/ExpressErrorMiddlewareInterface';
import {defaultFakeService} from '../../FakeService';
import {Middleware} from '../../../../../src/decorator/Middleware';

@Middleware({type: 'after'})
export class QuestionErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error: any, request: any, response: any, next?: (err?: any) => any): any {
    defaultFakeService.questionErrorMiddleware();
    next(error);
  }
}

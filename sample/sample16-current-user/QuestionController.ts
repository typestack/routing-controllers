
import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { User } from './User';
import { CurrentUser } from '../../src/decorator/CurrentUser';

@JsonController()
export class QuestionController {
  @Get('/questions')
  all(@CurrentUser({ required: true }) user: User) {
    return [
      {
        id: 1,
        title: 'Question by ' + user.firstName,
      },
    ];
  }
}

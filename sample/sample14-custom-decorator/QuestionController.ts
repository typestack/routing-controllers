import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { UserFromSession } from './UserFromSession';
import { User } from './User';

@JsonController()
export class QuestionController {
  @Get('/questions')
  all(@UserFromSession({ required: true }) user: User) {
    return [
      {
        id: 1,
        title: 'Question created by ' + user.firstName,
      },
    ];
  }
}

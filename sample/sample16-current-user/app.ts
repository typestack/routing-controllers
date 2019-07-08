import 'reflect-metadata';
import {createExpressServer} from '../../src/index';
import {QuestionController} from './QuestionController';
import {Action} from '../../src/Action';
import {User} from './User';

createExpressServer({
  controllers: [QuestionController],
  currentUserChecker: async (action: Action, value?: any) => {
    // perform queries based on token from request headers
    // const token = action.request.headers["authorization"];
    // return database.findUserByToken(token);
    return new User(1, 'Johny', 'Cage');
  },
}).listen(3001);

console.log('Express server is running on port 3001. Open http://localhost:3001/questions/');

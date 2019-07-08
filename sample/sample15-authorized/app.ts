import 'reflect-metadata';
import {createExpressServer} from '../../src/index';
import {QuestionController} from './QuestionController';
import {Action} from '../../src/Action';

createExpressServer({
  controllers: [QuestionController],
  authorizationChecker: async (action: Action, roles?: Array<string>) => {
    // perform queries based on token from request headers
    // const token = action.request.headers["authorization"];
    // return database.findUserByToken(token).roles.in(roles);
    return false;
  },
}).listen(3001);

console.log('Express server is running on port 3001. Open http://localhost:3001/questions/');

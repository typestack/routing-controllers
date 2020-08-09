import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import { QuestionController } from './QuestionController';

createExpressServer({
  controllers: [QuestionController],
}).listen(3001);

console.log('Express server is running on port 3001. Open http://localhost:3001/questions/');

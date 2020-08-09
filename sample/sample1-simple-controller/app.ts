import 'reflect-metadata';
import { createExpressServer } from '../../src/index';

require('./UserController');

const app = createExpressServer(); // register controllers routes in our express application
app.listen(3001); // run express app

console.log('Express server is running on port 3001. Open http://localhost:3001/users/');

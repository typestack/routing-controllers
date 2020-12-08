
import { useExpressServer } from '../../src/index';
import * as express from 'express';
import * as session from 'express-session';

require('./UserController');

const app = express();
app.use(session()); // use session middleware

useExpressServer(app); // register controllers routes in our express application
app.listen(3001); // run express app

console.log('Express server is running on port 3001. Open http://localhost:3001/users/');

import * as express from 'express';
import {registerActionsInExpressApp} from 'controllers.ts/Factory';
import kernel from './inversify.config';
import InversifyContainer from './InversifyContainer';

let app = express();
registerActionsInExpressApp(app, [`${__dirname}/controllers`], new InversifyContainer(kernel));
app.listen(3001, 'localhost');
console.log('Listening on port 3001. Visit http://localhost;3001/respond');
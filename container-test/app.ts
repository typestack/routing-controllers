import * as express from 'express';
import {registerActionsInExpressApp} from '../src/Factory';
import kernel from './inversify.config';
import InversifyContainer from './InversifyContainer';

let app = express();
registerActionsInExpressApp(app, [`${__dirname}/controllers`], new InversifyContainer(kernel));
app.listen(3000, 'localhost');
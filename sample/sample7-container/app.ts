import * as express from 'express';
import {setContainer, registerActionsInExpressApp} from '../../src/Factory';
import kernel from './kernel';
import ControllerContainer from './ControllerContainer';

let app = express();

setContainer(new ControllerContainer(kernel));
registerActionsInExpressApp(app);

app.listen(3001, 'localhost');
console.log('Listening on port 3001. Visit http://localhost:3001/respond');
import * as express from 'express';
import {registerActionsInExpressApp} from '../../src/Factory';
import kernel from './kernel';
import ControllerContainer from './ControllerContainer';

let app = express();

registerActionsInExpressApp(app, {requireDirs: [__dirname + "/controllers"], container: new ControllerContainer(kernel)});

app.listen(3001, 'localhost');
console.log('Listening on port 3001. Visit http://localhost:3001/respond');
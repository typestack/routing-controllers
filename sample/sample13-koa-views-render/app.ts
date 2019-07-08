import 'reflect-metadata';
import * as Koa from 'koa';

import {useKoaServer} from '../../src/index';

require('./BlogController');

const koa = new Koa();
const app = useKoaServer(koa);
const path = __dirname + '/../../../../sample/sample13-koa-views-render';

const koaViews = require('koa-views');
app.use(koaViews(path, {map: {html: 'handlebars'}}));

app.listen(3001); // run koa app

console.log('Koa server is running on port 3001. Open http://localhost:3001/');

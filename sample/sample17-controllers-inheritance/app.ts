
import * as express from 'express';
import { useExpressServer } from '../../src/index';

let app = express(); // create express server
useExpressServer(app, {
  controllers: [__dirname + '/controllers/*{.js,.ts}'], // register controllers routes in our express app
});
app.listen(3001); // run express app

console.log(
  'Possible GET endpoints you may see from a browser',
  'http://localhost:3001/article',
  'http://localhost:3001/article/1000',
  'http://localhost:3001/product',
  'http://localhost:3001/product/1000',
  'http://localhost:3001/category',
  'http://localhost:3001/category/1000'
);

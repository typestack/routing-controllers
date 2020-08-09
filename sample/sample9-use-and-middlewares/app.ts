import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import './BlogController'; // same as: require("./BlogController");

const app = createExpressServer(); // register controller actions in express app
app.listen(3001); // run express app

console.log('Express server is running on port 3001. Open http://localhost:3001/blogs/');

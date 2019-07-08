import 'reflect-metadata';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
import {Render} from '../../src/decorator/Render';

@Controller()
export class UserController {
  @Get('/')
  @Render('blog.html')
  public blog() {
    return {
      title: 'My Blog',
      posts: [
        {
          title: 'Welcome to my blog',
          content: 'This is my new blog built with Koa, routing-controllers and koa-views',
        },
        {
          title: 'Hello World',
          content: 'Hello world from Koa and routing-controllers',
        },
      ],
    };
  }
}

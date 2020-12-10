import { Request } from 'express';
import { Get } from '../../../src/decorator/Get';
import { Req } from '../../../src/index';
import { Post } from '../../../src/decorator/Post';
import { Put } from '../../../src/decorator/Put';
import { Patch } from '../../../src/decorator/Patch';
import { Delete } from '../../../src/decorator/Delete';
import { JsonController } from '../../../src/decorator/JsonController';

@JsonController()
export class PostController {
  @Get('/posts')
  getAll() {
    return [
      { id: 1, name: 'First post!' },
      { id: 2, name: 'Second post!' },
    ];
  }

  @Get('/posts/:id')
  getOne() {
    return { id: 1, name: 'First post!' };
  }

  @Post('/posts')
  post(@Req() request: Request) {
    let post = JSON.stringify(request.body);
    return 'Post ' + post + ' !saved!';
  }

  @Put('/posts/:id')
  put(@Req() request: Request) {
    return 'Post #' + request.params.id + ' has been putted!';
  }

  @Patch('/posts/:id')
  patch(@Req() request: Request) {
    return 'Post #' + request.params.id + ' has been patched!';
  }

  @Delete('/posts/:id')
  remove(@Req() request: Request) {
    return 'Post #' + request.params.id + ' has been removed!';
  }
}

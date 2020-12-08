import { Request } from 'express';
import { JsonController } from '../../../src/decorator/JsonController';
import { Get } from '../../../src/decorator/Get';
import { Req } from '../../../src/index';
import { Post } from '../../../src/decorator/Post';
import { Put } from '../../../src/decorator/Put';
import { Patch } from '../../../src/decorator/Patch';
import { Delete } from '../../../src/decorator/Delete';

@JsonController()
export class BlogController {
  @Get('/blogs')
  getAll() {
    return [
      { id: 1, name: 'First blog!' },
      { id: 2, name: 'Second blog!' },
    ];
  }

  @Get('/blogs/:id')
  getOne() {
    return { id: 1, name: 'First blog!' };
  }

  @Post('/blogs')
  post(@Req() request: Request) {
    let blog = JSON.stringify(request.body);
    return 'Blog ' + blog + ' !saved!';
  }

  @Put('/blogs/:id')
  put(@Req() request: Request) {
    return 'Blog #' + request.params.id + ' has been putted!';
  }

  @Patch('/blogs/:id')
  patch(@Req() request: Request) {
    return 'Blog #' + request.params.id + ' has been patched!';
  }

  @Delete('/blogs/:id')
  remove(@Req() request: Request) {
    return 'Blog #' + request.params.id + ' has been removed!';
  }
}

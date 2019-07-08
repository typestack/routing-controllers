import {Request} from 'express';
import {Get} from '../../../src/decorator/Get';
import {Req} from '../../../src/index';
import {Post} from '../../../src/decorator/Post';
import {Put} from '../../../src/decorator/Put';
import {Patch} from '../../../src/decorator/Patch';
import {Delete} from '../../../src/decorator/Delete';
import {JsonController} from '../../../src/decorator/JsonController';

@JsonController()
export class PostController {
  @Get('/posts')
  public getAll() {
    return [{id: 1, name: 'First post!'}, {id: 2, name: 'Second post!'}];
  }

  @Get('/posts/:id')
  public getOne() {
    return {id: 1, name: 'First post!'};
  }

  @Patch('/posts/:id')
  public patch(@Req() request: Request) {
    return 'Post #' + request.params.id + ' has been patched!';
  }

  @Post('/posts')
  public post(@Req() request: Request) {
    const post = JSON.stringify(request.body);
    return 'Post ' + post + ' !saved!';
  }

  @Put('/posts/:id')
  public put(@Req() request: Request) {
    return 'Post #' + request.params.id + ' has been putted!';
  }

  @Delete('/posts/:id')
  public remove(@Req() request: Request) {
    return 'Post #' + request.params.id + ' has been removed!';
  }
}

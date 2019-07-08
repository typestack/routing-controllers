import {Request} from 'express';
import {JsonController} from '../../../src/decorator/JsonController';
import {Get} from '../../../src/decorator/Get';
import {Req} from '../../../src/index';
import {Post} from '../../../src/decorator/Post';
import {Put} from '../../../src/decorator/Put';
import {Patch} from '../../../src/decorator/Patch';
import {Delete} from '../../../src/decorator/Delete';

@JsonController()
export class BlogController {
  @Get('/blogs')
  public getAll() {
    return [{id: 1, name: 'First blog!'}, {id: 2, name: 'Second blog!'}];
  }

  @Get('/blogs/:id')
  public getOne() {
    return {id: 1, name: 'First blog!'};
  }

  @Patch('/blogs/:id')
  public patch(@Req() request: Request) {
    return 'Blog #' + request.params.id + ' has been patched!';
  }

  @Post('/blogs')
  public post(@Req() request: Request) {
    const blog = JSON.stringify(request.body);
    return 'Blog ' + blog + ' !saved!';
  }

  @Put('/blogs/:id')
  public put(@Req() request: Request) {
    return 'Blog #' + request.params.id + ' has been putted!';
  }

  @Delete('/blogs/:id')
  public remove(@Req() request: Request) {
    return 'Blog #' + request.params.id + ' has been removed!';
  }
}

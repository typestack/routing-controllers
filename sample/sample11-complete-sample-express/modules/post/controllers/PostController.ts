import {Request} from 'express';
import {JsonController} from '../../../../../src/decorator/JsonController';
import {Get} from '../../../../../src/decorator/Get';
import {Post} from '../../../../../src/decorator/Post';
import {Put} from '../../../../../src/decorator/Put';
import {Req} from '../../../../../src/decorator/Req';
import {Patch} from '../../../../../src/decorator/Patch';
import {Delete} from '../../../../../src/decorator/Delete';

@JsonController()
export class PostController {
  @Get('/posts')
  public getAll() {
    return this.createPromise([{id: 1, name: 'Post 1!'}, {id: 2, name: 'Post 2!'}], 3000);
  }

  @Get('/posts/:id')
  public getOne() {
    return this.createPromise({id: 1, name: 'Post 1!'}, 3000);
  }

  @Patch('/posts/:id')
  public patch(@Req() request: Request) {
    return this.createPromise('Post #' + request.params.id + ' has been patched!', 3000);
  }

  @Post('/posts')
  public post(@Req() request: Request) {
    const post = JSON.stringify(request.body);
    return this.createPromise('Post ' + post + ' !saved!', 3000);
  }

  @Put('/posts/:id')
  public put(@Req() request: Request) {
    return this.createPromise('Post #' + request.params.id + ' has been putted!', 3000);
  }

  @Delete('/posts/:id')
  public remove(@Req() request: Request) {
    return this.createPromise('Post #' + request.params.id + ' has been removed!', 3000);
  }

  private createPromise(data: any, timeout: number): Promise<any> {
    return new Promise<any>((ok, fail) => {
      setTimeout(() => ok(data), timeout);
    });
  }
}

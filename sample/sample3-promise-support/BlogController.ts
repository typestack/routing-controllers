import {Request} from 'express';
import {JsonController} from '../../src/decorator/JsonController';
import {Get} from '../../src/decorator/Get';
import {Req} from '../../src/index';
import {Post} from '../../src/decorator/Post';
import {Put} from '../../src/decorator/Put';
import {Patch} from '../../src/decorator/Patch';
import {Delete} from '../../src/decorator/Delete';

@JsonController()
export class BlogController {
  @Get('/blogs')
  public getAll() {
    return this.createPromise([{id: 1, name: 'Blog 1!'}, {id: 2, name: 'Blog 2!'}], 3000);
  }

  @Get('/blogs/:id')
  public getOne() {
    return this.createPromise({id: 1, name: 'Blog 1!'}, 3000);
  }

  @Patch('/blogs/:id')
  public patch(@Req() request: Request) {
    return this.createPromise('Blog #' + request.params.id + ' has been patched!', 3000);
  }

  @Post('/blogs')
  public post(@Req() request: Request) {
    const blog = JSON.stringify(request.body);
    return this.createPromise('Blog ' + blog + ' saved!', 3000);
  }

  @Put('/blogs/:id')
  public put(@Req() request: Request) {
    return this.createPromise('Blog #' + request.params.id + ' has been putted!', 3000);
  }

  @Delete('/blogs/:id')
  public remove(@Req() request: Request) {
    return this.createPromise('Blog #' + request.params.id + ' has been removed!', 3000);
  }

  /**
   * Creates a fake promise with timeout.
   */
  private createPromise(data: any, timeout: number): Promise<any> {
    return new Promise<any>((ok, fail) => {
      setTimeout(() => ok(data), timeout);
    });
  }
}

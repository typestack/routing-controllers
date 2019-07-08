import {JsonController} from '../../src/decorator/JsonController';
import {Get} from '../../src/decorator/Get';
import {Param} from '../../src/decorator/Param';
import {CompressionMiddleware} from './CompressionMiddleware';
import {AllControllerActionsMiddleware} from './AllControllerActionsMiddleware';
import {UseBefore} from '../../src/decorator/UseBefore';

@JsonController()
@UseBefore(AllControllerActionsMiddleware)
export class BlogController {
  @Get('/blogs')
  @UseBefore(CompressionMiddleware)
  @UseBefore((request: any, response: any, next: Function) => {
    console.log('wow middleware');
    next();
  })
  public getAll() {
    console.log('hello blog');
    return [{id: 1, firstName: 'First', secondName: 'blog'}, {id: 2, firstName: 'Second', secondName: 'blog'}];
  }

  @Get('/blogs/:id')
  public getOne(@Param('id') id: number) {
    return {id, firstName: 'First', secondName: 'blog'};
  }
}

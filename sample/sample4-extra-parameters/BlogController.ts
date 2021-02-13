import { JsonController } from '../../src/decorator/JsonController';
import { Get } from '../../src/decorator/Get';
import { Post } from '../../src/decorator/Post';
import { Put } from '../../src/decorator/Put';
import { Patch } from '../../src/decorator/Patch';
import { Delete } from '../../src/decorator/Delete';
import { QueryParam } from '../../src/decorator/QueryParam';
import { Param } from '../../src/decorator/Param';
import { Body } from '../../src/decorator/Body';

export interface BlogFilter {
  keyword: string;
  limit: number;
  offset: number;
}

@JsonController()
export class BlogController {
  @Get('/blogs')
  getAll(@QueryParam('filter', { required: true, parse: true }) filter: BlogFilter) {
    return [
      { id: 1, name: 'Blog ' + filter.keyword },
      { id: 2, name: 'Blog ' + filter.keyword },
    ];
  }

  @Get('/blogs/:id')
  getOne(@Param('id') id: number, @QueryParam('name') name: string) {
    return { id: id, name: name };
  }

  @Post('/blogs')
  post(@Body() blog: any) {
    return 'Blog ' + JSON.stringify(blog) + ' !saved!';
  }

  @Put('/blogs/:id')
  put(@Param('id') id: number) {
    return 'Blog #' + id + ' has been putted!';
  }

  @Patch('/blogs/:id')
  patch(@Param('id') id: number) {
    return 'Blog #' + id + ' has been patched!';
  }

  @Delete('/blogs/:id')
  remove(@Param('id') id: number) {
    return 'Blog #' + id + ' has been removed!';
  }
}

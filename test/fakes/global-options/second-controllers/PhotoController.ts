import {Controller} from '../../../../src/decorator/Controller';
import {Get} from '../../../../src/decorator/Get';

@Controller()
export class PhotoController {
  @Get('/photos')
  public getAll() {
    return 'Hello photos';
  }
}

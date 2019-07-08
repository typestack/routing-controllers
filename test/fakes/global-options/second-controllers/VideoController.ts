import {Controller} from '../../../../src/decorator/Controller';
import {Get} from '../../../../src/decorator/Get';

@Controller()
export class VideoController {

    @Get('/videos')
    public getAll() {
        return 'Hello videos';
    }

}

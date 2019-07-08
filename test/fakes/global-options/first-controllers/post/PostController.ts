import {JsonController} from '../../../../../src/decorator/JsonController';
import {Get} from '../../../../../src/decorator/Get';

@JsonController()
export class PostController {

    @Get('/posts')
    public getAll() {
        return [{
            id: 1,
            title: '#1',
        }, {
            id: 2,
            title: '#2',
        }];
    }

}

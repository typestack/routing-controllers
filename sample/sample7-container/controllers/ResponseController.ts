import {Request, Response} from 'express';
import {IHelloWorldService} from '../services/HelloWorldService';
import {Get} from '../../../src/decorator/Methods'
import {Req, Res} from '../../../src/decorator/Params'
import {Controller} from '../../../src/decorator/Controllers';

@Controller()
export default class ResponseController {
    
    constructor(private service: IHelloWorldService) {}
    
    @Get('/respond')
    respond(@Req() req: Request, @Res() res: Response) {
        return this.service.greet();
    }
}
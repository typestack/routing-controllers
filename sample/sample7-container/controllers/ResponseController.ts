import {Request, Response} from 'express';
import {inject} from 'inversify';
import {IHelloWorldService} from '../services/HelloWorldService';
import {Req, Res, Get, Controller} from 'controllers.ts/Decorators';

@inject('IHelloWorldService')
@Controller()
export default class ResponseController {
    
    constructor(private service: IHelloWorldService) {}
    
    @Get('/respond')
    respond(@Req() req: Request, @Res() res: Response) {
        return this.service.greet();
    }
}
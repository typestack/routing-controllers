import {MiddlewareInterface} from "../../../../src/middleware/MiddlewareInterface";
import {defaultFakeService} from "../FakeService";
import {Middleware} from "../../../../src/decorator/Middleware";

@Middleware({ global: true })
export class VideoMiddleware implements MiddlewareInterface {

    use(context: any, next?: (err?: any) => Promise<any>): Promise<any> {
        defaultFakeService.videoMiddleware();
        return next();
    }

}
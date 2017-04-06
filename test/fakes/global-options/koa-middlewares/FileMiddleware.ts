import {MiddlewareInterface} from "../../../../src/middleware/MiddlewareInterface";
import {defaultFakeService} from "../FakeService";
import {Middleware} from "../../../../src/decorator/Middleware";

@Middleware({ global: true })
export class FileMiddleware implements MiddlewareInterface {

    use(context: any, next?: (err?: any) => Promise<any>): Promise<any> {
        defaultFakeService.fileMiddleware();
        return next();
    }

}
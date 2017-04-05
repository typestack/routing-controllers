import {MiddlewareGlobalBefore} from "../../../../src/deprecated/JsonResponse";
import {MiddlewareInterface} from "../../../../src/middleware/MiddlewareInterface";
import {defaultFakeService} from "../FakeService";

@MiddlewareGlobalBefore()
export class VideoMiddleware implements MiddlewareInterface {

    use(context: any, next?: (err?: any) => Promise<any>): Promise<any> {
        defaultFakeService.videoMiddleware();
        return next();
    }

}